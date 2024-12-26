import { createRoute, z } from "@hono/zod-openapi";
import { ZodError } from "zod";
import type { App } from "..";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { cache } from "../middleware/cache";
import { withSearchParams } from "../middleware/withSearchParams";
import type { Tags } from "../types";

const path = "/v1/clubs";
const tags = ["Clubs"] satisfies Tags[];

const returnSchema = z
  .object({
    clubTag: z.string().openapi({ description: "The club tag.", example: "API" }),
    members: z
      .object({
        name: z.string().openapi({ description: "The member's name.", example: "Mozzy#9999" }),
      })
      .array()
      .openapi({
        description: "The members in the club. Only users in the top 10K of any relevant leaderboard will show here.",
        example: [{ name: "Mozzy#9999" }, { name: "TheFinalsApi#1337" }],
      }),
    leaderboards: z
      .object({
        leaderboard: z.string().openapi({ description: "The leaderboard identifier." }),
        rank: z.number().openapi({ description: "The rank of the club in this leaderboard." }),
        totalValue: z.number().openapi({
          description:
            "The total value of the club in this leaderboard. Combined rank score, fans, cashouts, or points of players from this club in the top 10K of players.",
        }),
      })
      .array()
      .openapi({
        description: "The club's ranks and values in different leaderboards.",
        example: [
          {
            leaderboard: "s5",
            rank: 1,
            totalValue: 1_408_049,
          },
          {
            leaderboard: "s5sponsor",
            rank: 5,
            totalValue: 3_132_748,
          },
        ],
      }),
  })
  .array()
  .openapi({ description: "Club data, categorized by leaderboards." });

export const registerClubRoutes = (app: App) => {
  const getRoute = createRoute({
    method: "get",
    path,
    middleware: [withSearchParams(["clubTagFilter", "exactClubTag"]), cache("v1-clubs", 30)],
    request: {
      query: z.object({
        clubTagFilter: z.string().optional().openapi({ description: "The club tag to filter by.", example: "OG" }),
        exactClubTag: z
          .enum(["true", "false"])
          .optional()
          .openapi({ description: "Whether to filter by exact club tag.", example: "true" }),
      }),
    },
    tags,
    summary: "Get clubs",
    description:
      "Get all clubs and their data. VERY experimental API. Includes any club that has any player in the top 10K of any mode (from any season that has clubs). This returns A LOT of data without filters.",
    responses: {
      200: {
        description: "The club data.",
        content: {
          "application/json": {
            schema: returnSchema,
          },
        },
      },
    },
  });

  app.openapi(getRoute, async (c) => {
    const { clubTagFilter, exactClubTag } = c.req.valid("query");

    const leaderboardWithClubs = leaderboardApiRoutes.filter((route) => route.hasClubData);

    const clubData = await Promise.all(
      leaderboardWithClubs.map(async (route) => {
        const data = await route.fetchData({ kv: c.env.KV, platform: "crossplay" });
        const parseResult = route.zodSchema.safeParse(data);
        if (!parseResult.success) {
          throw new ZodError(parseResult.error.errors);
        }

        const leaderboardId = route.id;

        // Aggregate total values and names for each club
        const totalValues: Record<string, { totalValue: number; members: { name: string }[] }> =
          parseResult.data.reduce(
            (
              acc: Record<string, { totalValue: number; members: { name: string }[] }>,
              entry: {
                name: string;
                clubTag: string;
                rankScore?: number;
                fans?: number;
                cashouts?: number;
                points?: number;
              },
            ) => {
              // Skip users without a clubTag
              if (!entry.clubTag) return acc;

              // Filter with clubTag query if provided
              if (
                (exactClubTag === "true" && entry.clubTag.toLowerCase() !== clubTagFilter?.toLowerCase()) ||
                (clubTagFilter && !entry.clubTag.toLowerCase().includes(clubTagFilter.toLowerCase()))
              ) {
                return acc;
              }

              const value = entry.rankScore ?? entry.fans ?? entry.cashouts ?? entry.points ?? 0;
              const clubData = acc[entry.clubTag] || { totalValue: 0, members: [] };

              clubData.totalValue += value;

              // Add member only if name doesn't already exist in members
              if (entry.name && !clubData.members.some((member) => member.name === entry.name)) {
                clubData.members.push({ name: entry.name });
              }

              acc[entry.clubTag] = clubData;

              return acc;
            },
            {},
          );

        // Create leaderboard values array
        const leaderboardValues = Object.entries(totalValues)
          .filter((x) => x[0])
          .map(([clubTag, { totalValue, members }]) => ({
            clubTag,
            totalValue,
            members,
          }))
          .sort((a, b) => b.totalValue - a.totalValue)
          .map((entry, index) => ({
            clubTag: entry.clubTag,
            leaderboardId,
            rank: index + 1,
            totalValue: entry.totalValue,
            members: entry.members,
          }));

        return leaderboardValues;
      }),
    );

    // Aggregate data by club
    const aggregatedClubs = clubData.flat().reduce(
      (
        acc: Record<
          string,
          {
            clubTag: string;
            members: { name: string }[];
            leaderboards: { leaderboard: string; rank: number; totalValue: number }[];
          }
        >,
        entry,
      ) => {
        const { clubTag, leaderboardId, rank, totalValue, members } = entry;
        if (!clubTag) return acc;

        if (!acc[clubTag]) {
          acc[clubTag] = { clubTag, members: [], leaderboards: [] };
        }

        acc[clubTag].members.push(...members);

        acc[clubTag].leaderboards.push({
          leaderboard: leaderboardId,
          rank,
          totalValue,
        });

        return acc;
      },
      {},
    );

    // Get the final response format
    const response = Object.values(aggregatedClubs).map((club) => ({
      clubTag: club.clubTag,
      members: club.members,
      leaderboards: club.leaderboards,
    }));

    return c.json(response, 200);
  });
};
