import type { Context } from "hono";
import { ZodError, type z } from "zod";
import { communityEventApiRoutes } from "../../apis/communityEvents";
import type {
  communityEvent200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../../schemas/responses";
import type { CommunityEventVersion, LeaderboardPlatforms, User } from "../../types";

export default async (c: Context<{ Bindings: CloudflareBindings }>, communityEventVersion: CommunityEventVersion) => {
  const { platform } = c.req.param();
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no community event version is provided, return an error
  if (!communityEventVersion)
    return c.json(
      {
        error: `No community event version provided. Valid versions: ${communityEventApiRoutes
          .map((x) => x.leaderboardVersion)
          .join(", ")}. Example: /v1/community-event/cb1`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  // Get the API route that matches the version
  const apiRoute = communityEventApiRoutes.find((route) => route.leaderboardVersion === communityEventVersion);

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Community event version '${communityEventVersion}' is not a valid version. Valid versions: ${communityEventApiRoutes
          .map((x) => x.leaderboardVersion)
          .join(", ")}. Example: /v1/community-event/cb1`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
  // @ts-ignore Cannot be bothed with this
  const validPlatformProvided = apiRoute.availablePlatforms.includes(platform as LeaderboardPlatforms);

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Community event version '${communityEventVersion}' requires a valid platform. Valid platforms: ${apiRoute.availablePlatforms.join(
          ", ",
        )}. Example: /v1/community-event/${communityEventVersion}/${apiRoute.availablePlatforms[0]}`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for community event version ${communityEventVersion}. Valid platforms: ${apiRoute.leaderboardVersion}. Example: /v1/community-event/${communityEventVersion}/steam`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
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
    const filteredEntries = parseResult.data.entries.filter((user: User) =>
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
        count: filteredEntries.length,
        data: {
          entries: returnCountOnly ? [] : filteredEntries,
          progress: parseResult.data.progress,
        },
      } satisfies z.infer<ReturnType<typeof communityEvent200ResponseSchema>>,
      200,
    );
  } catch (error) {
    console.error("Error in getCommunityEvent:", error);
    const isZodError = error instanceof ZodError;

    return c.json(
      {
        error: `${isZodError ? "A data validation error occurred while fetching the community event. This means unexpected data came in from Embark." : "An error occurred in the getCommunityEvent handler."} Community event: ${apiRoute.leaderboardVersion}`,
        zodError: isZodError ? error : undefined,
      } satisfies z.infer<typeof leaderboard500ResponseSchema>,
      500,
    );
  }
};
