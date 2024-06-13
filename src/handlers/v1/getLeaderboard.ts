import { Context } from "hono";
import { apiRoutes } from "../../apis/leaderboard";
import {
  LeaderboardAPIPlatformParam,
  LeaderboardAPIVersionParam,
  User,
} from "../../types";

export default async (c: Context) => {
  const { leaderboardVersion, platform } = c.req.param();
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no leaderboard version is provided, return an error
  if (!leaderboardVersion)
    return c.json(
      {
        error: `No leaderboard version provided. Valid versions: ${apiRoutes
          .flatMap(x => x.params.versions)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404
    );

  // Get the API route that matches the version
  const apiRoute = apiRoutes.find(route =>
    route.params.versions.includes(
      leaderboardVersion as LeaderboardAPIVersionParam
    )
  );

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' is not a valid version. Valid versions: ${apiRoutes
          .flatMap(x => x.params.versions)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404
    );

  const routeRequiresPlatform = apiRoute.params.platforms.length > 0;
  const validPlatformProvided = apiRoute.params.platforms.includes(
    platform as LeaderboardAPIPlatformParam
  );

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' requires a platform. Valid platforms: ${apiRoute.params.platforms.join(
          ", "
        )}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for leaderboard version ${leaderboardVersion}. Valid platforms: ${apiRoute.params.versions.join(
          ", "
        )}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404
    );

  try {
    const fetchedData = await apiRoute.fetchData(
      platform as LeaderboardAPIPlatformParam
    );

    // Validate and parse data with Zod schema
    const parseResult = apiRoute.zodSchema.safeParse(fetchedData);
    if (!parseResult.success) {
      throw new Error(parseResult.error.toString());
    }

    // Filter data by name query
    const filteredData = parseResult.data.filter((user: User) =>
      [user.name, user.steamName, user.xboxName, user.psnName].some(
        platformName =>
          platformName.toLowerCase().includes(nameFilter?.toLowerCase() ?? "")
      )
    );

    // Return data
    return c.json({
      meta: {
        ...(leaderboardVersion === "live"
          ? {
              developerMessage:
                "Please know that using 'live' as the version will always point to Season 2. Specify a version directly instead of using 'live' to avoid confusion.",
            }
          : {}),
        leaderboardVersion: apiRoute.leaderboardVersion,
        leaderboardPlatform: platform,
        nameFilter,
        returnCountOnly,
      },
      count: filteredData.length,
      data: returnCountOnly ? [] : filteredData,
    });
  } catch (error) {
    console.log("Error in getLeaderboard:", error);
    return c.json(
      {
        error: `An error occurred while fetching the leaderboard: ${apiRoute.leaderboardVersion}`,
      },
      500
    );
  }
};
