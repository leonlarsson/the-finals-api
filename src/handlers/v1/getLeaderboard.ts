import type { Context } from "hono";
import { ZodError } from "zod";
import { apiRoutes } from "../../apis/leaderboard";
import type { LeaderboardPlatforms, LeaderboardVersion, User } from "../../types";

export default async (c: Context<{ Bindings: CloudflareBindings }>, leaderboardVersion: LeaderboardVersion) => {
  const { platform } = c.req.param();
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no leaderboard version is provided, return an error
  if (!leaderboardVersion)
    return c.json(
      {
        error: `No leaderboard version provided. Valid versions: ${apiRoutes
          .map((x) => x.leaderboardVersion)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404,
    );

  // Get the API route that matches the version
  const apiRoute = apiRoutes.find((route) => route.leaderboardVersion === leaderboardVersion);

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' is not a valid version. Valid versions: ${apiRoutes
          .map((x) => x.leaderboardVersion)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404,
    );

  const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
  const validPlatformProvided = apiRoute.availablePlatforms.includes(platform as LeaderboardPlatforms);

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' requires a valid platform. Valid platforms: ${apiRoute.availablePlatforms.join(
          ", ",
        )}. Example: /v1/leaderboard/${leaderboardVersion}/${apiRoute.availablePlatforms[0]}`,
      },
      404,
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for leaderboard version ${leaderboardVersion}. Valid platforms: ${apiRoute.leaderboardVersion}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404,
    );

  try {
    const fetchedData = await apiRoute.fetchData({
      kv: c.env.KV,
      platform: platform as LeaderboardPlatforms,
    });

    // Validate and parse data with Zod schema
    const parseResult = apiRoute.zodSchema.safeParse(fetchedData);
    if (!parseResult.success) {
      throw new ZodError(parseResult.error.issues);
    }

    // Filter data by name query
    const filteredData = parseResult.data.filter((user: User) =>
      [user.name, user.steamName, user.xboxName, user.psnName].some((platformName) =>
        platformName.toLowerCase().includes(nameFilter?.toLowerCase() ?? ""),
      ),
    );

    // Return data
    return c.json(
      {
        meta: {
          leaderboardVersion: apiRoute.leaderboardVersion,
          leaderboardPlatform: platform,
          nameFilter,
          returnCountOnly,
        },
        count: filteredData.length,
        data: returnCountOnly ? [] : filteredData,
      },
      200,
    );
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    const isZodError = error instanceof ZodError;
    return c.json(
      {
        error: `${isZodError ? "A data validation error occurred while fetching the leaderboard This means unexpected data came in from Embark." : "An error occurred in the getLeaderboard handler."} Leaderboard: ${apiRoute.leaderboardVersion}`,
        zodError: isZodError ? error : undefined,
      },
      500,
    );
  }
};
