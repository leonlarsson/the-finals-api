import { createRoute, type z } from "@hono/zod-openapi";
import type { App } from "..";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import { cache } from "../middleware/cache";
import { withSearchParams } from "../middleware/withSearchParams";
import type {
  leaderboard200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../schemas/responses";
import type { BaseUser, LeaderboardPlatforms } from "../types";
import { standarQueryParams, standardLeaderboardResponses, standardPlatformPathParam } from "../utils/openApiStandards";

export const registerLeaderboardRoutes = (app: App) => {
  for (const apiRoute of leaderboardApiRoutes) {
    // Route spec
    const route = createRoute({
      method: "get",
      path: apiRoute.availablePlatforms.length
        ? `/v1/leaderboard/${apiRoute.id}/{platform}`
        : `/v1/leaderboard/${apiRoute.id}`,
      middleware: [
        withSearchParams(["name", "count"]),
        cache(`v1-leaderboard-${apiRoute.id}`, apiRoute.metadata.cacheMinutes ?? 10),
      ],
      request: {
        params: standardPlatformPathParam(apiRoute),
        query: standarQueryParams(),
      },
      tags: apiRoute.metadata.tags,
      summary: apiRoute.metadata.summary,
      description: apiRoute.metadata.description,
      responses: standardLeaderboardResponses(apiRoute),
    });

    // Handler
    app.openapi(route, async (c) => {
      // TODO: Figure out a type-safe way to handle this
      // @ts-ignore I am unable to use c.req.valid("param") because route.request.params can (and should be) be undefined if the api route does not require a platform
      const { platform } = c.req.param();
      const { count: returnCountOnly, name } = c.req.valid("query");
      const nameFilter = name;

      const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
      const validPlatformProvided = apiRoute.availablePlatforms.includes(platform as LeaderboardPlatforms);

      // If the API route requires a platform and no platform is provided, return an error
      if (routeRequiresPlatform && !validPlatformProvided) {
        return c.json(
          {
            error: `Leaderboard version '${apiRoute.id}' requires a valid platform. Valid platforms: ${apiRoute.availablePlatforms.join(
              ", ",
            )}. Example: /v1/leaderboard/${apiRoute.id}/${apiRoute.availablePlatforms[0]}`,
          } satisfies z.infer<typeof leaderboard404ResponseSchema>,
          404,
        );
      }

      // If the API route requires a platform and the provided platform is not available, return an error
      if (routeRequiresPlatform && platform && !validPlatformProvided) {
        return c.json(
          {
            error: `Platform '${platform}' is not available for leaderboard version ${apiRoute.id}. Valid platforms: ${apiRoute.id}. Example: /v1/leaderboard/${apiRoute.id}/steam`,
          } satisfies z.infer<typeof leaderboard404ResponseSchema>,
          404,
        );
      }

      try {
        const fetchedData = await apiRoute.fetchData({
          kv: c.env.KV,
          platform: platform as LeaderboardPlatforms,
        });

        // Filter data by name query
        const filteredData = (fetchedData as BaseUser[]).filter((user) =>
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
            count: filteredData.length,
            data: returnCountOnly ? [] : filteredData,
          } satisfies z.infer<ReturnType<typeof leaderboard200ResponseSchema>>,
          200,
        );
      } catch (error) {
        console.error("Error in getLeaderboard:", error);

        return c.json(
          {
            error: `An error occurred in the getLeaderboard handler. Leaderboard: ${apiRoute.id}. Error: ${error}`,
          } satisfies z.infer<typeof leaderboard500ResponseSchema>,
          500,
        );
      }
    });

    // Redirect all legacy version aliases
    leaderboardApiRoutes.forEach((apiRoute) => {
      apiRoute.legacyIds?.forEach((versionAlias) => {
        app.get(`/v1/leaderboard/${versionAlias}/:platform?`, (c) => {
          const platform = c.req.param("platform");
          const query = c.req.query();
          const queryString = new URLSearchParams(query).toString();
          const redirectUrl = platform
            ? `/v1/leaderboard/${apiRoute.id}/${platform}`
            : `/v1/leaderboard/${apiRoute.id}`;
          return c.redirect(queryString ? `${redirectUrl}?${queryString}` : redirectUrl);
        });
      });
    });
  }
};
