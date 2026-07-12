import { and, isNotNull, sql } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { clubRankings, leaderboardEntries } from "../db/schema";
import type { BaseAPIRoute, BaseUser, ClubBaseUser, LeaderboardPlatforms } from "../types";

const splitName = (name: string) => {
  const i = name.lastIndexOf("#");
  return i === -1
    ? { displayName: name, discriminator: null as string | null }
    : { displayName: name.slice(0, i), discriminator: name.slice(i + 1) };
};

// Value in the DB currently means the main score entity
const getValue = (entry: BaseUser | ClubBaseUser) => {
  const clubEntry = entry as ClubBaseUser;
  return clubEntry.rankScore ?? clubEntry.fans ?? clubEntry.cashouts ?? clubEntry.points ?? null;
};

const getClubTag = (entry: BaseUser | ClubBaseUser) => (entry as ClubBaseUser).clubTag || null;

const getRank = (entry: BaseUser | ClubBaseUser) => {
  const rank = (entry as { rank?: number }).rank;
  return typeof rank === "number" ? rank : null;
};

const BATCH_SIZE = 100;

// Upserts a leaderboard's entries into leaderboard_entries.
export const indexEntriesToD1 = async (
  db: DrizzleD1Database,
  leaderboardId: string,
  platform: LeaderboardPlatforms,
  entries: (BaseUser | ClubBaseUser)[],
) => {
  const now = Date.now();

  const rows = entries.map((entry) => {
    const { displayName, discriminator } = splitName(entry.name);
    return {
      leaderboardId,
      platform: platform ?? null,
      name: entry.name,
      displayName,
      discriminator,
      steamName: entry.steamName || null,
      xboxName: entry.xboxName || null,
      psnName: entry.psnName || null,
      clubTag: getClubTag(entry),
      rank: getRank(entry),
      value: getValue(entry),
      rawEntry: JSON.stringify(entry),
      updatedAt: now,
    };
  });

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    await db
      .insert(leaderboardEntries)
      .values(chunk)
      .onConflictDoUpdate({
        target: [leaderboardEntries.leaderboardId, leaderboardEntries.platform, leaderboardEntries.name],
        set: {
          steamName: sql`excluded.steam_name`,
          xboxName: sql`excluded.xbox_name`,
          psnName: sql`excluded.psn_name`,
          clubTag: sql`excluded.club_tag`,
          rank: sql`excluded.rank`,
          value: sql`excluded.value`,
          rawEntry: sql`excluded.raw_entry`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
  }
};

// Rebuilds club_rankings from scratch. Delete then insert, not upsert, so a club with no
// remaining members gets removed instead of leaving a stale row behind.
export const refreshClubRankings = async (db: DrizzleD1Database) => {
  const clubTotals = db
    .select({
      leaderboardId: leaderboardEntries.leaderboardId,
      clubTag: leaderboardEntries.clubTag,
      totalValue: sql<number>`SUM(${leaderboardEntries.value})`.as("total_value"),
      memberCount: sql<number>`COUNT(*)`.as("member_count"),
    })
    .from(leaderboardEntries)
    .where(and(isNotNull(leaderboardEntries.clubTag), sql`${leaderboardEntries.clubTag} != ''`))
    .groupBy(leaderboardEntries.leaderboardId, leaderboardEntries.clubTag)
    .as("club_totals");

  const rankedClubs = db
    .select({
      leaderboardId: clubTotals.leaderboardId,
      clubTag: clubTotals.clubTag,
      totalValue: clubTotals.totalValue,
      memberCount: clubTotals.memberCount,
      clubRank:
        sql<number>`RANK() OVER (PARTITION BY ${clubTotals.leaderboardId} ORDER BY ${clubTotals.totalValue} DESC)`.as(
          "club_rank",
        ),
      updatedAt: sql<number>`unixepoch() * 1000`.as("updated_at"),
    })
    .from(clubTotals);

  const deleteAll = db.run(sql`DELETE FROM club_rankings`);
  const rebuild = db.insert(clubRankings).select(rankedClubs);

  // batch, not two awaited calls, so club_rankings is never briefly empty mid-refresh
  await db.batch([deleteAll, rebuild]);
};

const indexRoutes = async (db: DrizzleD1Database, kv: KVNamespace, routes: BaseAPIRoute[]) => {
  for (const route of routes) {
    const platforms = route.availablePlatforms.length ? route.availablePlatforms : [undefined];

    for (const platform of platforms) {
      try {
        const data = await route.fetchData({ kv, platform });
        await indexEntriesToD1(db, route.id, platform, data);
      } catch (error) {
        console.error(`Error indexing leaderboard '${route.id}' (${platform ?? "no platform"}) to D1:`, error);
      }
    }
  }
};

// Refreshes the leaderboards that change over time. Runs every 2h alongside backupToKV,
// reusing the same fetchData call so Embark isn't fetched twice.
export const indexLiveLeaderboardsToD1 = async (d1: D1Database, kv: KVNamespace) => {
  const db = drizzle(d1);

  await indexRoutes(
    db,
    kv,
    leaderboardApiRoutes.filter((r) => r.backups?.kv),
  );
  await refreshClubRankings(db);
  await kv.put("last-d1-index", new Date().toISOString());

  return new Response("D1 live index complete");
};

// One-time indexing for leaderboards that never change again. Not on cron, triggered manually.
export const backfillOldLeaderboardsToD1 = async (d1: D1Database, kv: KVNamespace) => {
  const db = drizzle(d1);

  await indexRoutes(
    db,
    kv,
    leaderboardApiRoutes.filter((r) => !r.backups?.kv),
  );
  await refreshClubRankings(db);
  await kv.put("last-d1-backfill", new Date().toISOString());

  return new Response("D1 backfill complete");
};
