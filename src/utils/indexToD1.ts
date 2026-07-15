import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { clubRankings, leaderboardEntries } from "../db/schema";
import type { BaseAPIRoute, BaseUser, ClubBaseUser, LeaderboardPlatforms } from "../types";
import { getEntryValue } from "./getEntryValue";

const splitName = (name: string) => {
  const i = name.lastIndexOf("#");
  return i === -1
    ? { displayName: name, discriminator: null as string | null }
    : { displayName: name.slice(0, i), discriminator: name.slice(i + 1) };
};

const getClubTag = (entry: BaseUser | ClubBaseUser) => (entry as ClubBaseUser).clubTag || null;

const getRank = (entry: BaseUser | ClubBaseUser) => {
  const rank = (entry as { rank?: number }).rank;
  return typeof rank === "number" ? rank : null;
};

// 13 params per row, D1's real limit is ~100 per statement (not sqlite's usual 999), stay under 8.
const ROWS_PER_STATEMENT = 6;
// 6 params per row for club_rankings, more headroom than leaderboard_entries' wider rows.
const CLUB_ROWS_PER_STATEMENT = 12;
// Statements grouped into one db.batch() call, so this is one network round-trip, not many.
const STATEMENTS_PER_BATCH = 50;

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
      value: getEntryValue(entry),
      rawEntry: JSON.stringify(entry),
      updatedAt: now,
    };
  });

  const upsert = (chunk: typeof rows) =>
    db
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
        // skip the write when nothing meaningful changed; rank/change reshuffle constantly on their own
        setWhere: sql`json_remove(${leaderboardEntries.rawEntry}, '$.rank', '$.change') != json_remove(excluded.raw_entry, '$.rank', '$.change')`,
      });

  const statements = [];
  for (let i = 0; i < rows.length; i += ROWS_PER_STATEMENT) {
    statements.push(upsert(rows.slice(i, i + ROWS_PER_STATEMENT)));
  }

  for (let i = 0; i < statements.length; i += STATEMENTS_PER_BATCH) {
    const group = statements.slice(i, i + STATEMENTS_PER_BATCH);
    if (group.length) await db.batch(group as [(typeof statements)[number], ...(typeof statements)[number][]]);
  }

  // Removes players who fell off; can't use updatedAt anymore since unchanged rows skip the write above
  if (rows.length > 0) {
    const currentNames = entries.map((entry) => entry.name);
    await db
      .delete(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.leaderboardId, leaderboardId),
          platform ? eq(leaderboardEntries.platform, platform) : isNull(leaderboardEntries.platform),
          sql`${leaderboardEntries.name} NOT IN (SELECT value FROM json_each(${JSON.stringify(currentNames)}))`,
        ),
      );
  }
};

// Upserts club_rankings, skipping unchanged clubs, then removes clubs with no members left
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

  // Materialized (not a subquery insert) because SQLite rejects ON CONFLICT after INSERT...SELECT...FROM
  const rankedClubs = await db
    .select({
      leaderboardId: clubTotals.leaderboardId,
      clubTag: clubTotals.clubTag,
      totalValue: clubTotals.totalValue,
      memberCount: clubTotals.memberCount,
      clubRank: sql<number>`RANK() OVER (PARTITION BY ${clubTotals.leaderboardId} ORDER BY ${clubTotals.totalValue} DESC)`,
    })
    .from(clubTotals);

  const now = Date.now();
  // clubTag is guaranteed non-null by clubTotals' WHERE clause, TS just can't see through the aggregate
  const rows = rankedClubs.map((row) => ({ ...row, clubTag: row.clubTag as string, updatedAt: now }));

  const upsert = (chunk: typeof rows) =>
    db
      .insert(clubRankings)
      .values(chunk)
      .onConflictDoUpdate({
        target: [clubRankings.leaderboardId, clubRankings.clubTag],
        set: {
          totalValue: sql`excluded.total_value`,
          memberCount: sql`excluded.member_count`,
          clubRank: sql`excluded.club_rank`,
          updatedAt: sql`excluded.updated_at`,
        },
        // clubRank reshuffles on its own when other clubs move; only write on a real stat change
        setWhere: sql`${clubRankings.totalValue} != excluded.total_value OR ${clubRankings.memberCount} != excluded.member_count`,
      });

  const statements = [];
  for (let i = 0; i < rows.length; i += CLUB_ROWS_PER_STATEMENT) {
    statements.push(upsert(rows.slice(i, i + CLUB_ROWS_PER_STATEMENT)));
  }

  for (let i = 0; i < statements.length; i += STATEMENTS_PER_BATCH) {
    const group = statements.slice(i, i + STATEMENTS_PER_BATCH);
    if (group.length) await db.batch(group as [(typeof statements)[number], ...(typeof statements)[number][]]);
  }

  // Removes clubs with no remaining qualifying members in any leaderboard
  await db.delete(clubRankings).where(sql`
    NOT EXISTS (
      SELECT 1 FROM ${leaderboardEntries}
      WHERE ${leaderboardEntries.leaderboardId} = ${clubRankings.leaderboardId}
        AND ${leaderboardEntries.clubTag} = ${clubRankings.clubTag}
        AND ${leaderboardEntries.clubTag} != ''
    )
  `);
};

const indexRoutes = async (db: DrizzleD1Database, kv: KVNamespace, routes: BaseAPIRoute[]) => {
  for (const route of routes) {
    const platforms = route.availablePlatforms.length ? route.availablePlatforms : [undefined];

    for (const platform of platforms) {
      try {
        const data = await route.fetchData({ kv, platform });
        await indexEntriesToD1(db, route.id, platform, data);
      } catch (error) {
        const cause = error instanceof Error && error.cause ? String(error.cause) : String(error);
        console.error(`Error indexing leaderboard '${route.id}' (${platform ?? "no platform"}) to D1: ${cause}`);
      }
    }
  }
};

// Refreshes the leaderboards that change over time. Runs every 4h, independent of the 2h KV backup.
export const indexLiveLeaderboardsToD1 = async (d1: D1Database, kv: KVNamespace) => {
  const db = drizzle(d1);

  await indexRoutes(
    db,
    kv,
    leaderboardApiRoutes.filter((r) => r.backups?.kv),
  );
  try {
    await refreshClubRankings(db);
  } catch (error) {
    const cause = error instanceof Error && error.cause ? String(error.cause) : String(error);
    console.error(`Error refreshing club_rankings: ${cause}`);
  }
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
  try {
    await refreshClubRankings(db);
  } catch (error) {
    const cause = error instanceof Error && error.cause ? String(error.cause) : String(error);
    console.error(`Error refreshing club_rankings: ${cause}`);
  }
  await kv.put("last-d1-backfill", new Date().toISOString());

  return new Response("D1 backfill complete");
};
