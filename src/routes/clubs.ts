import { createRoute, z } from "@hono/zod-openapi";
import { and, asc, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { App } from "..";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { clubRankings, leaderboardEntries } from "../db/schema";
import { cache } from "../middleware/cache";
import type { Tags } from "../types";
import { booleanQuerySchema, commaSeparatedQuerySchema } from "../utils/openApiParams";

const tags = ["Clubs"] satisfies Tags[];

const clubLeaderboardIds = leaderboardApiRoutes.filter((route) => route.hasClubData).map((route) => route.id) as [
  string,
  ...string[],
];

const badRequestSchema = z.object({ error: z.string() });

const clubEntrySchema = z.object({
  leaderboardId: z.string().openapi({ description: "The leaderboard identifier.", example: "s11" }),
  totalValue: z.number().openapi({
    description: "The club's combined rank score, fans, cashouts, or points on this leaderboard.",
  }),
  memberCount: z.number().openapi({ description: "The number of members contributing to this leaderboard." }),
  clubRank: z.number().openapi({ description: "The club's rank on this leaderboard." }),
  updatedAt: z
    .string()
    .openapi({ description: "When this entry was last indexed.", example: "2026-07-13T18:02:09.342Z" }),
});

const clubMemberSchema = z.object({
  name: z.string().openapi({ description: "The member's name.", example: "Mozzy#9999" }),
});

const clubReturnSchema = z.object({
  clubTag: z.string().openapi({ description: "The club tag.", example: "EMBRK" }),
  members: clubMemberSchema
    .array()
    .openapi({ description: "Members of this club. Only users in the top 10K of any relevant leaderboard show here." }),
  leaderboards: clubEntrySchema.array().openapi({ description: "Every leaderboard this club appears in." }),
});

const searchReturnSchema = z.object({
  query: z.string(),
  exactMatch: z.boolean(),
  leaderboards: z
    .string()
    .array()
    .nullable()
    .openapi({ description: "The leaderboards the search was restricted to. Null means all leaderboards." }),
  count: z.number().openapi({ description: "The number of unique clubs returned. Capped at 1,000." }),
  clubs: clubReturnSchema.array(),
});

const notFoundSchema = z.object({
  error: z.string(),
  searchUrl: z.string().openapi({ description: "Try a partial-match search instead.", example: "/v1/clubs?q=EMBRK" }),
});

export const registerClubRoutes = (app: App) => {
  const getRoute = createRoute({
    method: "get",
    path: "/v1/club/{clubTag}",
    middleware: [cache("v1-club", 10)],
    request: {
      params: z.object({
        clubTag: z
          .string()
          .max(100)
          .openapi({
            param: { name: "clubTag", in: "path" },
            description: "The exact club tag to search for. Case-insensitive.",
            example: "EMBRK",
          }),
      }),
      query: z.object({
        withMembers: booleanQuerySchema("withMembers", {
          description: "Whether to also include the club's member list.",
        }),
      }),
    },
    tags,
    summary: "Get a club",
    description:
      "Get a club's entries across every leaderboard it appears on, by exact (case-insensitive) club tag match. Backed by a D1 index refreshed every 2 hours for live leaderboards.",
    responses: {
      200: {
        description: "The club's data.",
        content: { "application/json": { schema: clubReturnSchema } },
      },
      404: {
        description: "No club found with this club tag.",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  });

  app.openapi(getRoute, async (c) => {
    const { clubTag } = c.req.valid("param");
    const { withMembers } = c.req.valid("query");
    const db = drizzle(c.env.DB);

    const [rankingRows, memberRows] = await Promise.all([
      db
        .select()
        .from(clubRankings)
        .where(sql`${clubRankings.clubTag} = ${clubTag} COLLATE NOCASE`)
        .orderBy(asc(clubRankings.clubRank)),
      withMembers
        ? db
            .selectDistinct({ name: leaderboardEntries.name })
            .from(leaderboardEntries)
            .where(sql`${leaderboardEntries.clubTag} = ${clubTag} COLLATE NOCASE`)
        : [],
    ]);

    if (rankingRows.length === 0) {
      return c.json(
        {
          error: `No club found with tag '${clubTag}'.`,
          searchUrl: `/v1/clubs?q=${encodeURIComponent(clubTag)}`,
        } satisfies z.infer<typeof notFoundSchema>,
        404,
      );
    }

    return c.json(
      {
        clubTag: rankingRows[0].clubTag,
        members: memberRows.map((row) => ({ name: row.name })),
        leaderboards: rankingRows.map((row) => ({
          leaderboardId: row.leaderboardId,
          totalValue: row.totalValue,
          memberCount: row.memberCount,
          clubRank: row.clubRank,
          updatedAt: new Date(row.updatedAt).toISOString(),
        })),
      } satisfies z.infer<typeof clubReturnSchema>,
      200,
    );
  });

  const searchRoute = createRoute({
    method: "get",
    path: "/v1/clubs",
    middleware: [cache("v1-clubs-search", 10)],
    request: {
      query: z.object({
        q: z
          .string()
          .min(2)
          .max(100)
          .openapi({
            param: { name: "q", in: "query" },
            description: "Partial club tag to search for. Minimum 2, maximum 100 characters.",
            example: "EMBRK",
          }),
        exactMatch: booleanQuerySchema("exactMatch", {
          description: "Whether to match the whole club tag exactly instead of a partial match.",
        }),
        withMembers: booleanQuerySchema("withMembers", {
          description: "Whether to also include each matched club's member list.",
        }),
        leaderboards: commaSeparatedQuerySchema("leaderboards", clubLeaderboardIds, {
          description:
            "Comma-separated leaderboard IDs to restrict the search to. Unrecognized IDs are ignored. Defaults to all leaderboards.",
          example: "s11,s10sponsor",
          lenient: true,
        }),
      }),
    },
    tags,
    summary: "Search clubs",
    description:
      "Search for clubs by partial club tag match, across every leaderboard at once. Backed by a D1 index refreshed every 2 hours for live leaderboards. Results are capped at 1,000 rows, sorted by rank.",
    responses: {
      200: {
        description: "Matching entries.",
        content: { "application/json": { schema: searchReturnSchema } },
      },
      400: {
        description: "The search query could not be matched.",
        content: { "application/json": { schema: badRequestSchema } },
      },
    },
  });

  app.openapi(searchRoute, async (c) => {
    const { q, exactMatch, withMembers, leaderboards } = c.req.valid("query");
    const db = drizzle(c.env.DB);

    const clubTagMatch = exactMatch
      ? sql`${clubRankings.clubTag} = ${q} COLLATE NOCASE`
      : like(clubRankings.clubTag, `%${q}%`);
    const memberClubTagMatch = exactMatch
      ? sql`${leaderboardEntries.clubTag} = ${q} COLLATE NOCASE`
      : like(leaderboardEntries.clubTag, `%${q}%`);

    // json_each binds the list as one param, avoiding D1's ~100 bound-parameter limit
    const rankingsWhere = leaderboards?.length
      ? and(
          sql`${clubRankings.leaderboardId} IN (SELECT value FROM json_each(${JSON.stringify(leaderboards)}))`,
          clubTagMatch,
        )
      : clubTagMatch;
    const membersWhere = leaderboards?.length
      ? and(
          sql`${leaderboardEntries.leaderboardId} IN (SELECT value FROM json_each(${JSON.stringify(leaderboards)}))`,
          memberClubTagMatch,
        )
      : memberClubTagMatch;

    let rows: (typeof clubRankings.$inferSelect)[];
    let memberRows: { name: string; clubTag: string | null }[];
    try {
      [rows, memberRows] = await Promise.all([
        db.select().from(clubRankings).where(rankingsWhere).orderBy(asc(clubRankings.clubRank)).limit(1000),
        withMembers
          ? db
              .selectDistinct({ name: leaderboardEntries.name, clubTag: leaderboardEntries.clubTag })
              .from(leaderboardEntries)
              .where(membersWhere)
          : [],
      ]);
    } catch (error) {
      const cause = error instanceof Error && error.cause ? String(error.cause) : String(error);
      if (cause.includes("too complex")) {
        return c.json(
          {
            error: "Search term is too complex to match. Try a shorter or less repetitive query.",
          } satisfies z.infer<typeof badRequestSchema>,
          400,
        );
      }
      throw error;
    }

    const namesByClubTag = new Map<string, z.infer<typeof clubMemberSchema>[]>();
    for (const row of memberRows) {
      if (!row.clubTag) continue;
      let names = namesByClubTag.get(row.clubTag);
      if (!names) {
        names = [];
        namesByClubTag.set(row.clubTag, names);
      }
      names.push({ name: row.name });
    }

    const clubsMap = new Map<string, z.infer<typeof clubEntrySchema>[]>();
    for (const row of rows) {
      let leaderboards = clubsMap.get(row.clubTag);
      if (!leaderboards) {
        leaderboards = [];
        clubsMap.set(row.clubTag, leaderboards);
      }
      leaderboards.push({
        leaderboardId: row.leaderboardId,
        totalValue: row.totalValue,
        memberCount: row.memberCount,
        clubRank: row.clubRank,
        updatedAt: new Date(row.updatedAt).toISOString(),
      });
    }

    const clubs = Array.from(clubsMap, ([clubTag, leaderboards]) => ({
      clubTag,
      members: namesByClubTag.get(clubTag) ?? [],
      leaderboards,
    }));

    return c.json(
      {
        query: q,
        exactMatch,
        leaderboards: leaderboards?.length ? leaderboards : null,
        count: clubs.length,
        clubs,
      } satisfies z.infer<typeof searchReturnSchema>,
      200,
    );
  });
};
