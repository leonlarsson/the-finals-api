import { z } from "zod";
import {
  leaderboardCountQuerySchema,
  leaderboardNameQuerySchema,
  leaderboardPlatformParamSchema,
} from "../schemas/requests";
import {
  leaderboard200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../schemas/responses";
import type { LeaderboardAPIRoute } from "../types";

export const standarQueryParams = () =>
  z.object({
    count: leaderboardCountQuerySchema,
    name: leaderboardNameQuerySchema,
  });

export const standardPlatformPathParam = (apiRoute: LeaderboardAPIRoute) =>
  apiRoute.availablePlatforms.length ? z.object({ platform: leaderboardPlatformParamSchema(apiRoute) }) : undefined;

export const standardLeaderboardResponses = (apiRoute: LeaderboardAPIRoute) => ({
  200: {
    content: {
      "application/json": {
        schema: leaderboard200ResponseSchema(apiRoute.zodSchemaOpenApi),
      },
    },
    description: "Retrieve the leaderboard",
  },
  404: {
    content: {
      "application/json": {
        schema: leaderboard404ResponseSchema,
      },
    },
    description: "Leaderboard or platform was not found",
  },
  500: {
    content: {
      "application/json": {
        schema: leaderboard500ResponseSchema,
      },
    },
    description: "An error occurred",
  },
});
