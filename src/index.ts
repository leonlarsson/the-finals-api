import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { registerAuthComponent } from "./components/auth";
import { authentication } from "./middleware/authentication";
import { registerClubRoutes } from "./routes/clubs";
import { registerCommunityEventRoutes } from "./routes/community-event";
import { registerLeaderboardRoutes } from "./routes/leaderboard";
import { registerTflNoticeRoutes } from "./routes/tfl-notice";
import type { HonoEnv } from "./types";
import { backupToKV } from "./utils/backupToKV";

const app = new OpenAPIHono<HonoEnv>();
export type App = typeof app;

// Enable CORS for all routes
app.use(cors());

// Enable context storage for all routes
app.use(contextStorage());

// Register components
registerAuthComponent(app);

// Register routes
registerLeaderboardRoutes(app);
registerCommunityEventRoutes(app);
registerClubRoutes(app);
registerTflNoticeRoutes(app);

// The OpenAPI spec will be available at /openapi.json
app.doc("/openapi.json", {
  tags: [
    {
      name: "Leaderboards",
      description: "Endpoints for the main leaderboards.",
    },
    {
      name: "Leaderboards - Special",
      description: "Endpoints for special leaderboards, such as minigame leaderboards or ungrouped leaderboards.",
    },
    {
      name: "Community Events",
      description: "Endpoints for community events.",
    },
    {
      name: "Clubs",
      description: "Endpoints for clubs.",
    },
    {
      name: "the-finals-leaderboard.com",
      description:
        "Endpoints for things that concern [the-finals-leaderboard.com](https://the-finals-leaderboard.com).",
    },
  ],
  openapi: "3.0.0",
  servers: [
    {
      url: "https://api.the-finals-leaderboard.com",
      description: "Production Cloudflare Worker",
    },
    {
      url: "http://127.0.0.1:8787",
      description: "Local Development Environment",
    },
  ],
  info: {
    version: "1.0.0",
    title: "THE FINALS API",
    description:
      "The API specification for [leonlarsson/the-finals-api](https://github.com/leonlarsson/the-finals-api).<br />Here you can browse and test all available endpoints.<br /><br />This is the API that powers [the-finals-leaderboard.com](https://the-finals-leaderboard.com) and many others.",
    contact: {
      url: "https://github.com/leonlarsson/the-finals-api",
    },
  },
});

// The API Reference will be available at /
app.get(
  "/",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    // (No longer) Downgraded to avoid: https://github.com/scalar/scalar/issues/4167 and https://github.com/scalar/scalar/issues/4210
    cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.28.7",
    pageTitle: "THE FINALS API",
    favicon: "https://the-finals-leaderboard.com/favicon.png",
    theme: "default",
    layout: "modern",
  }),
);

// 404 anything else
app.notFound((c) =>
  c.json({ error: "Route not found. Check https://api.the-finals-leaderboard.com for all available routes." }, 404),
);

export default {
  fetch: app.fetch,
  scheduled: (event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) => {
    if (event.cron === "0 */2 * * *") {
      ctx.waitUntil(backupToKV(env.KV));
    }

    if (event.cron === "30 */12 * * *") {
    }
  },
};

// Just a test
app.get("/backup-via-workflow", authentication, async (c) => {
  await c.env.BACKUP_WORKFLOW.create();
});

export { BackupWorkflow } from "./workflows/backup";
