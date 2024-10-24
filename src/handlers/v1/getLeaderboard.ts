import type { Context } from "hono";
import { ZodError, type z } from "zod";
import { leaderboardApiRoutes } from "../../apis/leaderboard";
import type {
  leaderboard200ResponseSchema,
  leaderboard404ResponseSchema,
  leaderboard500ResponseSchema,
} from "../../schemas/responses";
import type { LeaderboardPlatforms, User } from "../../types";

export default async (c: Context<{ Bindings: CloudflareBindings }>, id: string) => {
  const { platform } = c.req.param();
  const returnCountOnly = ["true", "1"].includes(c.req.query("count") ?? "");
  const nameFilter = c.req.query("name");

  // If no leaderboard version is provided, return an error
  if (!id)
    return c.json(
      {
        error: `No leaderboard version provided. Valid versions: ${leaderboardApiRoutes
          .map((x) => x.id)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  // Get the API route that matches the version
  const apiRoute = leaderboardApiRoutes.find((route) => route.id === id);

  // If no API route matches the version, return an error
  if (!apiRoute)
    return c.json(
      {
        error: `Leaderboard version '${id}' is not a valid version. Valid versions: ${leaderboardApiRoutes
          .map((x) => x.id)
          .join(", ")}. Example: /v1/leaderboard/cb1`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  const routeRequiresPlatform = apiRoute.availablePlatforms.length > 0;
  const validPlatformProvided = apiRoute.availablePlatforms.includes(platform as LeaderboardPlatforms);

  // If the API route requires a platform and no platform is provided, return an error
  if (routeRequiresPlatform && !validPlatformProvided)
    return c.json(
      {
        error: `Leaderboard version '${id}' requires a valid platform. Valid platforms: ${apiRoute.availablePlatforms.join(
          ", ",
        )}. Example: /v1/leaderboard/${id}/${apiRoute.availablePlatforms[0]}`,
      } satisfies z.infer<typeof leaderboard404ResponseSchema>,
      404,
    );

  // If the API route requires a platform and the provided platform is not available, return an error
  if (routeRequiresPlatform && platform && !validPlatformProvided)
    return c.json(
      {
        error: `Platform '${platform}' is not available for leaderboard version ${id}. Valid platforms: ${apiRoute.id}. Example: /v1/leaderboard/${id}/steam`,
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
    const filteredData = parseResult.data.filter((user: User) =>
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
    const isZodError = error instanceof ZodError;

    return c.json(
      {
        error: `${isZodError ? "A data validation error occurred while fetching the leaderboard. This means unexpected data came in from Embark." : "An error occurred in the getLeaderboard handler."} Leaderboard: ${apiRoute.id}`,
        zodError: isZodError ? error : undefined,
      } satisfies z.infer<typeof leaderboard500ResponseSchema>,
      500,
    );
  }
};
