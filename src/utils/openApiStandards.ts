import { z } from "zod";
import {
  leaderboardClubTagQuerySchema,
  leaderboardCountQuerySchema,
  leaderboardExactClubTagQuerySchema,
  leaderboardNameQuerySchema,
  leaderboardPlatformParamSchema,
} from "../schemas/requests";
import {
  communityEvent200ResponseSchema,
  leaderboard200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../schemas/responses";
import type { BaseAPIRoute } from "../types";

export const standardQueryParams = () =>
  z.object({
    count: leaderboardCountQuerySchema,
    name: leaderboardNameQuerySchema,
    clubTag: leaderboardClubTagQuerySchema,
    exactClubTag: leaderboardExactClubTagQuerySchema,
  });

export const standardPlatformPathParam = (apiRoute: BaseAPIRoute) =>
  apiRoute.availablePlatforms.length ? z.object({ platform: leaderboardPlatformParamSchema(apiRoute) }) : undefined;

export const standardLeaderboardResponses = (apiRoute: BaseAPIRoute) => ({
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

export const standardCommunityEventResponses = (apiRoute: BaseAPIRoute) => ({
  200: {
    content: {
      "application/json": {
        schema: communityEvent200ResponseSchema(apiRoute.zodSchemaOpenApi),
      },
    },
    description: "Retrieve the community event progress and entries",
  },
  404: {
    content: {
      "application/json": {
        schema: leaderboard404ResponseSchema,
      },
    },
    description: "Community event or platform was not found",
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
