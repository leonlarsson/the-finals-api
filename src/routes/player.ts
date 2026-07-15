import { createRoute, z } from "@hono/zod-openapi";
import { and, asc, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { App } from "..";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { leaderboardEntries } from "../db/schema";
import { cache } from "../middleware/cache";
import type { Tags } from "../types";
import { booleanQuerySchema, commaSeparatedQuerySchema } from "../utils/openApiParams";

const tags = ["Players"] satisfies Tags[];

// Additional fields vary per leaderboard (fame, cashouts, points, sponsor, etc.), spread from raw_entry
const entrySchema = z
  .object({
    leaderboardId: z.string().openapi({ description: "The leaderboard identifier.", example: "s11" }),
    platform: z.string().nullable().openapi({ description: "The platform, if applicable.", example: "crossplay" }),
    updatedAt: z
      .string()
      .openapi({ description: "When this entry was last indexed.", example: "2026-07-13T18:02:09.342Z" }),
  })
  .catchall(z.any());

const playerReturnSchema = z.object({
  name: z.string().openapi({ description: "The player's full name.", example: "Balise#2431" }),
  displayName: z.string().openapi({ description: "The player's name without the discriminator.", example: "Balise" }),
  discriminator: z.string().nullable().openapi({ description: "The player's discriminator.", example: "2431" }),
  leaderboards: entrySchema.array().openapi({ description: "Every leaderboard/platform this player appears in." }),
});

const searchMetaSchema = z
  .object({
    query: z.string(),
    exactMatch: z.boolean(),
    platforms: z.string().array().openapi({ description: "The fields that were actually searched." }),
    leaderboards: z
      .string()
      .array()
      .nullable()
      .openapi({ description: "The leaderboards the search was restricted to. Null means all leaderboards." }),
  })
  .openapi({ title: "Player Search Meta", description: "Metadata about the player search response." });

const searchReturnSchema = z.object({
  meta: searchMetaSchema,
  count: z.number().openapi({ description: "The number of entries returned. Capped at 1,000." }),
  entries: entrySchema.array(),
});

const notFoundSchema = z.object({
  error: z.string(),
  searchUrl: z
    .string()
    .openapi({ description: "Try a partial-match search instead.", example: "/v1/players?q=balise" }),
});

const badRequestSchema = z.object({ error: z.string() });

const searchableFields = {
  name: leaderboardEntries.name,
  steam: leaderboardEntries.steamName,
  xbox: leaderboardEntries.xboxName,
  psn: leaderboardEntries.psnName,
} as const;

type SearchableField = keyof typeof searchableFields;
const allSearchableFields = Object.keys(searchableFields) as SearchableField[];
const searchableFieldEnum = allSearchableFields as [SearchableField, ...SearchableField[]];

const allLeaderboardIds = leaderboardApiRoutes.map((route) => route.id) as [string, ...string[]];

const toEntry = (row: typeof leaderboardEntries.$inferSelect) => ({
  leaderboardId: row.leaderboardId,
  platform: row.platform,
  updatedAt: new Date(row.updatedAt).toISOString(),
  ...JSON.parse(row.rawEntry),
});

export const registerPlayerRoutes = (app: App) => {
  const getRoute = createRoute({
    method: "get",
    path: "/v1/player/{name}",
    middleware: [cache("v1-player", 10)],
    request: {
      params: z.object({
        name: z
          .string()
          .max(100)
          .openapi({
            param: { name: "name", in: "path" },
            description: "The exact player Embark name to search for. Case-insensitive. URL-encode it please.",
            example: "Balise#2431",
          }),
      }),
    },
    tags,
    summary: "Get a player",
    description:
      "Get a player's entries across every leaderboard they appear on, by exact (case-insensitive) Embark name match. Backed by a D1 index refreshed every 4 hours for live leaderboards.",
    responses: {
      200: {
        description: "The player's data.",
        content: { "application/json": { schema: playerReturnSchema } },
      },
      404: {
        description: "No player found with this Embark name.",
        content: { "application/json": { schema: notFoundSchema } },
      },
    },
  });

  app.openapi(getRoute, async (c) => {
    const { name } = c.req.valid("param");
    const db = drizzle(c.env.DB);

    const rows = await db
      .select()
      .from(leaderboardEntries)
      .where(sql`${leaderboardEntries.name} = ${name} COLLATE NOCASE`);

    if (rows.length === 0) {
      return c.json(
        {
          error: `No player found with name '${name}'.`,
          searchUrl: `/v1/players?q=${encodeURIComponent(name)}`,
        } satisfies z.infer<typeof notFoundSchema>,
        404,
      );
    }

    const [first] = rows;

    return c.json(
      {
        name: first.name,
        displayName: first.displayName,
        discriminator: first.discriminator,
        leaderboards: rows.map(toEntry).sort((a, b) => a.leaderboardId.localeCompare(b.leaderboardId)),
      } satisfies z.infer<typeof playerReturnSchema>,
      200,
    );
  });

  const searchRoute = createRoute({
    method: "get",
    path: "/v1/players",
    middleware: [cache("v1-players-search", 10)],
    request: {
      query: z.object({
        q: z
          .string()
          .min(2)
          .max(100)
          .openapi({
            param: { name: "q", in: "query" },
            description:
              "Partial name to search for. Matches against the Embark name and all platform names by default. Minimum 2, maximum 100 characters.",
            example: "balise",
          }),
        platforms: commaSeparatedQuerySchema("platforms", searchableFieldEnum, {
          description: `Comma-separated fields to search. One or more of: ${allSearchableFields.join(", ")}. Defaults to all.`,
          example: "steam",
        }),
        leaderboards: commaSeparatedQuerySchema("leaderboards", allLeaderboardIds, {
          description: "Comma-separated leaderboard IDs to restrict the search to. Defaults to all leaderboards.",
          example: "s11,s8sponsor",
        }),
        exactMatch: booleanQuerySchema("exactMatch", {
          description: "Whether to match the whole field exactly instead of a partial match.",
          example: "true",
        }),
      }),
    },
    tags,
    summary: "Search players",
    description:
      "Search for players by partial name match, across every leaderboard at once. Backed by a D1 index refreshed every 4 hours for live leaderboards. Results are capped at 1,000 rows, sorted by rank.",
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
    const { q, platforms, exactMatch, leaderboards } = c.req.valid("query");
    const db = drizzle(c.env.DB);
    const likePattern = `%${q}%`;

    const fields = platforms?.length ? platforms : allSearchableFields;

    const matchField = (field: (typeof searchableFields)[SearchableField]) =>
      exactMatch ? sql`${field} = ${q} COLLATE NOCASE` : like(field, likePattern);

    const fieldMatch = or(...fields.map((field) => matchField(searchableFields[field])));
    // json_each binds the list as one param, avoiding D1's ~100 bound-parameter limit
    const where = leaderboards?.length
      ? and(
          sql`${leaderboardEntries.leaderboardId} IN (SELECT value FROM json_each(${JSON.stringify(leaderboards)}))`,
          fieldMatch,
        )
      : fieldMatch;

    let rows: (typeof leaderboardEntries.$inferSelect)[];
    try {
      rows = await db.select().from(leaderboardEntries).where(where).orderBy(asc(leaderboardEntries.rank)).limit(1000);
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

    return c.json(
      {
        meta: {
          query: q,
          exactMatch,
          platforms: fields,
          leaderboards: leaderboards?.length ? leaderboards : null,
        },
        count: rows.length,
        entries: rows.map(toEntry),
      } satisfies z.infer<typeof searchReturnSchema>,
      200,
    );
  });
};
