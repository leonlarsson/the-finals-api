import { createRoute, type z } from "@hono/zod-openapi";
import type { App } from "..";
import { communityEventApiRoutes } from "../apis/communityEvents";
import { cache } from "../middleware/cache";
import { withSearchParams } from "../middleware/withSearchParams";
import type {
  communityEvent200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../schemas/responses";
import type { BaseUser, LeaderboardPlatforms } from "../types";
import {
  standarQueryParams,
  standardCommunityEventResponses,
  standardPlatformPathParam,
} from "../utils/openApiStandards";

export const registerCommunityEventRoutes = (app: App) => {
  for (const apiRoute of communityEventApiRoutes) {
    // Route spec
    const route = createRoute({
      method: "get",
      path: apiRoute.availablePlatforms.length
        ? `/v1/community-event/${apiRoute.id}/{platform}`
        : `/v1/community-event/${apiRoute.id}`,
      middleware: [
        withSearchParams(["name", "count"]),
        cache(`v1-community-event-${apiRoute.id}`, apiRoute.metadata.cacheMinutes ?? 10),
      ],
      request: {
        params: standardPlatformPathParam(apiRoute),
        query: standarQueryParams(),
      },
      tags: apiRoute.metadata.tags,
      summary: apiRoute.metadata.summary,
      description: apiRoute.metadata.description,
      responses: standardCommunityEventResponses(apiRoute),
    });

    // Handler
    app.openapi(route, async (c) => {
      // TODO: Figure out a type-safe way to handle this
      // @ts-ignore I am unable to use c.req.valid("param") because route.request.params can (and should be) be undefined if the api route does not require a platform
      const { platform } = c.req.param();
      const { count, name } = c.req.valid("query");
      const returnCountOnly = ["true", "1"].includes(count ?? "");
      const nameFilter = name;

      const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
      const validPlatformProvided = apiRoute.availablePlatforms.includes(platform as LeaderboardPlatforms);

      // If the API route requires a platform and no platform is provided, return an error
      if (routeRequiresPlatform && !validPlatformProvided) {
        return c.json(
          {
            error: `Community event version '${apiRoute.id}' requires a valid platform. Valid platforms: ${apiRoute.availablePlatforms.join(
              ", ",
            )}. Example: /v1/community-event/${apiRoute.id}/${apiRoute.availablePlatforms[0]}`,
          } satisfies z.infer<typeof leaderboard404ResponseSchema>,
          404,
        );
      }

      // If the API route requires a platform and the provided platform is not available, return an error
      if (routeRequiresPlatform && platform && !validPlatformProvided) {
        return c.json(
          {
            error: `Platform '${platform}' is not available for community event version ${apiRoute.id}. Valid platforms: ${apiRoute.id}. Example: /v1/community-event/${apiRoute.id}/steam`,
          } satisfies z.infer<typeof leaderboard404ResponseSchema>,
          404,
        );
      }

      try {
        const fetchedData = (await apiRoute.fetchData({
          kv: c.env.KV,
          platform: platform as LeaderboardPlatforms,
        })) as { entries: BaseUser[]; progress: { currentProgress: number; goal: number } };

        // Filter data by name query
        const filteredEntries = fetchedData.entries.filter((user) =>
          [user.name, user.steamName, user.xboxName, user.psnName].some((platformName) =>
            platformName.toLowerCase().includes(nameFilter?.toLowerCase() ?? ""),
          ),
        );

        // Return data
        return c.json(
          {
            meta: {
              leaderboardVersion: apiRoute.id,
              leaderboardPlatform: platform,
              dataSource: c.get("leaderboardDataSource"),
              nameFilter,
              returnCountOnly,
            },
            count: filteredEntries.length,
            data: {
              progress: fetchedData.progress,
              entries: returnCountOnly ? [] : filteredEntries,
            },
          } satisfies z.infer<ReturnType<typeof communityEvent200ResponseSchema>>,
          200,
        );
      } catch (error) {
        console.error("Error in getCommunityEvent:", error);

        return c.json(
          {
            error: `An error occurred in the getCommunityEvent handler. Community event: ${apiRoute.id}. Error: ${error}`,
          } satisfies z.infer<typeof leaderboard500ResponseSchema>,
          500,
        );
      }
    });
  }
};
