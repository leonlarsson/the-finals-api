import { Context } from "hono";
import { apiRoutes } from "../../embarkApis";
import { transformApiData } from "../../utils";
import { APIPlatform, RawUser } from "../../types";

export default async (c: Context) => {
  const { version: leaderboardVersion, platform } = c.req.param();
  const returnRawData = ["true", "1"].includes(c.req.query("raw") ?? "");
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no leaderboard version is provided, return an error
  if (!leaderboardVersion)
    return c.json(
      {
        error: `No leaderboard version provided. Valid versions: ${apiRoutes
          .flatMap(x => x.version)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404
    );

  // Get the API route that matches the version
  const apiRoute = apiRoutes.find(route =>
    route.version.includes(leaderboardVersion)
  );

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' is not a valid version. Valid versions: ${apiRoutes
          .flatMap(x => x.version)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404
    );

  const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
  const validPlatformProvided = apiRoute.availablePlatforms.includes(platform);

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' requires a platform. Valid platforms: ${apiRoute.availablePlatforms.join(
          ", "
        )}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for leaderboard version ${leaderboardVersion}. Valid platforms: ${apiRoute.availablePlatforms.join(
          ", "
        )}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404
    );

  const apiUrl = apiRoute.url(platform as APIPlatform);

  try {
    const res = await fetch(apiUrl);
    const data = (await res.json()) as RawUser[];

    // Filter data by name query
    const filteredData = data.filter(user =>
      [user.name, user.steam, user.xbox, user.psn].some(platformName =>
        platformName?.toLowerCase().includes(nameFilter?.toLowerCase() ?? "")
      )
    );

    const dataToReturn = returnRawData
      ? filteredData
      : transformApiData(filteredData);

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
        error: `An error occurred while fetching the leaderboard: ${apiUrl}`,
      },
      500
    );
  }
};
