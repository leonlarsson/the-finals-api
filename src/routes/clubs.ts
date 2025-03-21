import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "..";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { cache } from "../middleware/cache";
import { withSearchParams } from "../middleware/withSearchParams";
import type { ClubBaseUser, Tags } from "../types";

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

    const normalizedClubTagFilter = clubTagFilter?.toLowerCase();
    const useExactClubTag = exactClubTag === "true";

    const leaderboardWithClubs = leaderboardApiRoutes.filter((route) => route.hasClubData);

    // Create a single map for club aggregation
    const clubsMap = new Map<
      string,
      {
        clubTag: string;
        members: Map<string, { name: string }>;
        leaderboards: { leaderboard: string; rank: number; totalValue: number }[];
      }
    >();

    await Promise.all(
      leaderboardWithClubs.map(async (route) => {
        const leaderboardData = (await route.fetchData({ kv: c.env.KV, platform: "crossplay" })) as ClubBaseUser[];
        const leaderboardId = route.id;

        // Calculate scores in a single pass
        const clubScores = new Map<string, number>();

        // Create a temporary map to track all clubs and their members
        const tempClubMembers = new Map<string, Set<string>>();

        for (const leaderboardUser of leaderboardData) {
          if (!leaderboardUser.clubTag) continue;

          // Calculate total value for ranking
          const value =
            leaderboardUser.rankScore ??
            leaderboardUser.fans ??
            leaderboardUser.cashouts ??
            leaderboardUser.points ??
            0;
          clubScores.set(leaderboardUser.clubTag, (clubScores.get(leaderboardUser.clubTag) || 0) + value);

          // Collect members
          if (leaderboardUser.name) {
            let memberSet = tempClubMembers.get(leaderboardUser.clubTag);
            if (!memberSet) {
              memberSet = new Set();
              tempClubMembers.set(leaderboardUser.clubTag, memberSet);
            }
            memberSet.add(leaderboardUser.name);
          }
        }

        // Calculate ranks
        const clubRanks = new Map<string, { rank: number; totalValue: number }>();

        [...clubScores.entries()]
          .sort((a, b) => b[1] - a[1])
          .forEach(([clubTag, totalValue], index) => {
            clubRanks.set(clubTag, { rank: index + 1, totalValue });
          });

        // Process filtered clubs
        for (const [clubTag, rankData] of clubRanks.entries()) {
          // Apply filtering
          if (normalizedClubTagFilter) {
            const normalizedClubTag = clubTag.toLowerCase();
            if (useExactClubTag) {
              if (normalizedClubTag !== normalizedClubTagFilter) continue;
            } else {
              if (!normalizedClubTag.includes(normalizedClubTagFilter)) continue;
            }
          }

          // Add or update club in the global map
          let clubData = clubsMap.get(clubTag);
          if (!clubData) {
            clubData = {
              clubTag,
              members: new Map(),
              leaderboards: [],
            };
            clubsMap.set(clubTag, clubData);
          }

          // Add leaderboard data
          clubData.leaderboards.push({
            leaderboard: leaderboardId,
            rank: rankData.rank,
            totalValue: rankData.totalValue,
          });

          // Add members
          const memberSet = tempClubMembers.get(clubTag);
          if (memberSet) {
            for (const name of memberSet) {
              clubData.members.set(name, { name });
            }
          }
        }
      }),
    );

    // Create final response
    const response = [...clubsMap.values()]
      .map((club) => ({
        clubTag: club.clubTag,
        members: Array.from(club.members.values()),
        leaderboards: club.leaderboards.sort((a, b) => a.rank - b.rank),
      }))
      .sort((a, b) => a.clubTag.localeCompare(b.clubTag));

    return c.json(response, 200);
  });
};
