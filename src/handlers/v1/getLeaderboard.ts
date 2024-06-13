import { Context } from "hono";
import { apiRoutes } from "../../apis";
import { APIPlatformParam, APIVersionParam, RawUser } from "../../types";
import transformApiData from "../../utils/transformApiData";

export default async (c: Context) => {
  const { leaderboardVersion, platform } = c.req.param();
  const returnRawData = ["true", "1"].includes(c.req.query("raw") ?? "");
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
    route.params.versions.includes(leaderboardVersion as APIVersionParam)
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
    platform as APIPlatformParam
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
    const data = await apiRoute.fetchData(platform as APIPlatformParam);
    if (data === null) {
      return c.json({ error: "No valid data returned :(" }, 500);
    }

    // Filter data by name query
    const filteredData = data.filter(user =>
      [
        user.name,
        "steam" in user ? user.steam : undefined,
        "xbox" in user ? user.xbox : undefined,
        "psn" in user ? user.psn : undefined,
      ].some(platformName =>
        platformName?.toLowerCase().includes(nameFilter?.toLowerCase() ?? "")
      )
    );

    const dataToReturn = returnRawData
      ? filteredData
      : transformApiData(apiRoute.leaderboardVersion, filteredData);

    // Return data
    return c.json({
      meta: {
        leaderboardVersion: leaderboardVersion,
        leaderboardPlatform: platform,
        nameFilter,
        returnRawData,
        returnCountOnly,
      },
      count: filteredData.length,
      data: returnCountOnly ? [] : dataToReturn,
    });
  } catch (error) {
    return c.json(
      {
        error: `An error occurred while fetching the leaderboard: ${apiRoute.leaderboardVersion}`,
      },
      500
    );
  }
};
