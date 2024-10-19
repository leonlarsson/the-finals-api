import { type ZodSchema, z } from "zod";
import type { LeaderboardVersion } from "../types";

export const standarQueryParams = () =>
  z.object({
    // TODO: Make boolean. There is currently a bug if I use a boolean.
    count: z
      .enum(["true", "false"])
      .optional()
      .openapi({
        param: {
          name: "count",
          in: "query",
        },
        example: "false",
        description: "Return only the count of the leaderboard. Default: false",
      }),
    name: z
      .string()
      .optional()
      .openapi({
        param: {
          name: "name",
          in: "query",
        },
        example: "TTV",
        description: "Filter the leaderboard entries by name.",
      }),
  });

export const standardPlatformPathParam = (leaderboardVersion: LeaderboardVersion, platforms: string[]) =>
  platforms.length
    ? z.object({
        platform: z
          .enum(platforms as [string, ...string[]], {
            message: `This leaderboard requires one of the following platforms: ${platforms.join(", ")}. Example: /v1/leaderboard/${leaderboardVersion}/${platforms[0]}`,
          })
          .openapi({
            param: {
              name: "platform",
              in: "path",
            },
            example: platforms[0],
          }),
      })
    : undefined;

export const standardLeaderboardResponses = (responseSchema: ZodSchema) => ({
  200: {
    content: {
      "application/json": {
        schema: z.object({
          meta: z.object({
            leaderboardVersion: z.string(),
            leaderboardPlatform: z.string(),
            nameFilter: z.string().optional(),
            returnCountOnly: z.boolean(),
          }),
          count: z.number(),
          data: responseSchema,
        }),
      },
    },
    description: "Retrieve the leaderboard",
  },
  404: {
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
        }),
      },
    },
    description: "Leaderboard or platform was not found",
  },
  500: {
    content: {
      "application/json": {
        schema: z.object({
          error: z.string(),
          zodError: z.any().optional(),
        }),
      },
    },
    description: "An error occurred",
  },
});
