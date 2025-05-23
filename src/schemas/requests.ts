import { z } from "zod";
import type { BaseAPIRoute } from "../types";

export const leaderboardPlatformParamSchema = (apiRoute: BaseAPIRoute) =>
  z
    .enum(apiRoute.availablePlatforms as [string, ...string[]], {
      message: `This leaderboard requires one of the following platforms: ${apiRoute.availablePlatforms.join(", ")}. Example: /v1/leaderboard/${apiRoute.id}/${apiRoute.availablePlatforms[0]}`,
    })
    .openapi({
      param: {
        name: "platform",
        in: "path",
      },
      example: apiRoute.availablePlatforms[0],
    });

export const leaderboardCountQuerySchema = z
  .enum(["true", "false"])
  .default("false")
  .transform((v) => v === "true")
  .openapi({
    param: {
      name: "count",
      in: "query",
    },
    example: "true",
    description: "Return only the count of the leaderboard.",
  });

export const leaderboardNameQuerySchema = z
  .string()
  .optional()
  .openapi({
    param: {
      name: "name",
      in: "query",
    },
    example: "TTV",
    description: "Filter the leaderboard entries by name.",
  });

export const leaderboardClubTagQuerySchema = z
  .string()
  .optional()
  .openapi({
    param: {
      name: "clubTag",
      in: "query",
    },
    description: "The club tag to filter by. Will only work in leaderboards that support club tags.",
    example: "OG",
  });

export const leaderboardExactClubTagQuerySchema = z
  .enum(["true", "false"])
  .default("false")
  .transform((v) => v === "true")
  .openapi({
    param: {
      name: "exactClubTag",
      in: "query",
    },
    description: "Whether to filter by exact club tag. Will only work in leaderboards that support club tags.",
    example: "true",
  });
