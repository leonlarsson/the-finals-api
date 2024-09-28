import type { Context } from "hono";
import { ZodError } from "zod";
import { apiRoutes } from "../../apis/leaderboard";
import type { LeaderboardAPIPlatformParam, LeaderboardAPIVersionParam, User } from "../../types";

export default async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const { leaderboardVersion, platform } = c.req.param();
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no leaderboard version is provided, return an error
  if (!leaderboardVersion)
    return c.json(
      {
        error: `No leaderboard version provided. Valid versions: ${apiRoutes
          .flatMap((x) => x.params.versions)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404,
    );

  // Get the API route that matches the version
  const apiRoute = apiRoutes.find((route) =>
    route.params.versions.includes(leaderboardVersion as LeaderboardAPIVersionParam),
  );

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' is not a valid version. Valid versions: ${apiRoutes
          .flatMap((x) => x.params.versions)
          .filter((x) => x !== "live")
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      },
      404,
    );

  const routeRequiresPlatform = apiRoute.params.platforms.length > 0;
  const validPlatformProvided = apiRoute.params.platforms.includes(platform as LeaderboardAPIPlatformParam);

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Leaderboard version '${leaderboardVersion}' requires a valid platform. Valid platforms: ${apiRoute.params.platforms.join(
          ", ",
        )}. Example: /v1/leaderboard/${leaderboardVersion}/${apiRoute.params.platforms[0]}`,
      },
      404,
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for leaderboard version ${leaderboardVersion}. Valid platforms: ${apiRoute.params.versions.join(
          ", ",
        )}. Example: /v1/leaderboard/${leaderboardVersion}/steam`,
      },
      404,
    );

  try {
    const fetchedData = await apiRoute.fetchData({
      kv: c.env.KV,
      platform: platform as LeaderboardAPIPlatformParam,
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
