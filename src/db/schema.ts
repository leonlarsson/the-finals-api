import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const leaderboardEntries = sqliteTable(
  "leaderboard_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    leaderboardId: text("leaderboard_id").notNull(),
    platform: text("platform"),
    name: text("name").notNull(),
    displayName: text("display_name").notNull(),
    discriminator: text("discriminator"),
    steamName: text("steam_name"),
    xboxName: text("xbox_name"),
    psnName: text("psn_name"),
    clubTag: text("club_tag"),
    rank: integer("rank"),
    value: integer("value"),
    rawEntry: text("raw_entry").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    unique("leaderboard_entries_leaderboard_id_platform_name_unique").on(
      table.leaderboardId,
      table.platform,
      table.name,
    ),
    index("idx_entries_name").on(sql`${table.name} COLLATE NOCASE`),
    index("idx_entries_display_name").on(sql`${table.displayName} COLLATE NOCASE`),
    index("idx_entries_club_tag").on(sql`${table.clubTag} COLLATE NOCASE`),
    index("idx_entries_leaderboard_id").on(table.leaderboardId),
  ],
);

export const clubRankings = sqliteTable(
  "club_rankings",
  {
    leaderboardId: text("leaderboard_id").notNull(),
    clubTag: text("club_tag").notNull(),
    totalValue: integer("total_value").notNull(),
    memberCount: integer("member_count").notNull(),
    clubRank: integer("club_rank").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.leaderboardId, table.clubTag] }),
    index("idx_club_rankings_club_tag").on(sql`${table.clubTag} COLLATE NOCASE`),
  ],
);
