import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { communityEventApiRoutes } from "./apis/communityEvents";
import { leaderboardApiRoutes } from "./apis/leaderboard";
import backup from "./handlers/backup";
import tflNotice from "./handlers/tflNotice";
import getCommunityEvent from "./handlers/v1/getCommunityEvent";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import { cache } from "./middleware/cache";
import {
  standarQueryParams,
  standardCommunityEventResponses,
  standardLeaderboardResponses,
  standardPlatformPathParam,
} from "./utils/openApiStandards";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

// Enable CORS for all routes
app.use("*", cors());

// Cache all leaderboard routes
app.use("/v1/leaderboard/*", cache("v1-leaderboard", 10));

// Cache all community event routes
app.use("/v1/community-event/*", cache("v1-community-event", 10));

// Routes

// Create OpenAPI routes for all leaderboard routes
leaderboardApiRoutes.forEach((apiRoute) => {
  const route = createRoute({
    method: "get",
    path: apiRoute.availablePlatforms.length
      ? `/v1/leaderboard/${apiRoute.leaderboardVersion}/{platform}`
      : `/v1/leaderboard/${apiRoute.leaderboardVersion}`,
    request: {
      params: standardPlatformPathParam(apiRoute),
      query: standarQueryParams(),
    },
    tags: [apiRoute.type.charAt(0).toUpperCase() + apiRoute.type.slice(1)],
    summary: apiRoute.metadata.title,
    description: apiRoute.metadata.description,
    responses: standardLeaderboardResponses(apiRoute),
  });

  // Handler
  app.openapi(route, (c) => getLeaderboard(c, apiRoute.leaderboardVersion));
});

// Create OpenAPI routes for all community event routes
communityEventApiRoutes.forEach((apiRoute) => {
  const route = createRoute({
    method: "get",
    path: apiRoute.availablePlatforms.length
      ? `/v1/community-event/${apiRoute.leaderboardVersion}/{platform}`
      : `/v1/community-event/${apiRoute.leaderboardVersion}`,
    request: {
      params: standardPlatformPathParam(apiRoute),
      query: standarQueryParams(),
    },
    tags: [apiRoute.type.charAt(0).toUpperCase() + apiRoute.type.slice(1)],
    summary: apiRoute.metadata.title,
    description: apiRoute.metadata.description,
    responses: standardCommunityEventResponses(apiRoute),
  });

  // Handler
  app.openapi(route, (c) => getCommunityEvent(c, apiRoute.leaderboardVersion));
});

// Redirect all version aliases
leaderboardApiRoutes.forEach((apiRoute) => {
  apiRoute.leaderboardVersionAliases.forEach((versionAlias) => {
    app.get(`/v1/leaderboard/${versionAlias}/:platform?`, (c) => {
      const platform = c.req.param("platform");
      const query = c.req.query();
      const queryString = new URLSearchParams(query).toString();
      const redirectUrl = platform
        ? `/v1/leaderboard/${apiRoute.leaderboardVersion}/${platform}`
        : `/v1/leaderboard/${apiRoute.leaderboardVersion}`;
      return c.redirect(queryString ? `${redirectUrl}?${queryString}` : redirectUrl);
    });
  });
});

// THE Finals Leaderboard Notice
app.get("/tfl-notice", cache("tfl-notice", 1), tflNotice);

// The OpenAPI spec will be available at /openapi.json
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "THE FINALS API",
  },
});

// The API Reference will be available at /
app.get(
  "/",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    pageTitle: "THE FINALS API",
    favicon: "https://the-finals-leaderboard.com/favicon.png",
    theme: "saturn",
    layout: "modern",
  }),
);

// Redirect any other route to the API Reference
app.notFound((c) => c.redirect("/", 302));

export default {
  fetch: app.fetch,
  scheduled: (_event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) => {
    ctx.waitUntil(backup(env.KV));
  },
};
