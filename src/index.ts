import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { registerAuthComponent } from "./components/auth";
import { authentication } from "./middleware/authentication";
import { registerClubRoutes } from "./routes/clubs";
import { registerCommunityEventRoutes } from "./routes/community-event";
import { registerLeaderboardRoutes } from "./routes/leaderboard";
import { registerPlayerRoutes } from "./routes/player";
import { registerTflNoticeRoutes } from "./routes/tfl-notice";
import type { HonoEnv } from "./types";
import { backupToKV } from "./utils/backupToKV";
import { backupToR2 } from "./utils/backupToR2";
import { backfillOldLeaderboardsToD1, indexLiveLeaderboardsToD1 } from "./utils/indexToD1";

const app = new OpenAPIHono<HonoEnv>({
  // zod v4 changed ZodError's default JSON shape; restore the v3 issues-array shape for API consumers
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ success: false, error: { issues: result.error.issues, name: result.error.name } }, 400);
    }
  },
});
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
registerPlayerRoutes(app);
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
      name: "Players",
      description: "Endpoints for players.",
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
  Scalar({
    spec: {
      url: "/openapi.json",
    },
    cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.62.4",
    pageTitle: "THE FINALS API",
    favicon: "https://the-finals-leaderboard.com/favicon.png",
    theme: "deepSpace",
    layout: "modern",

    // Disable unused things
    showDeveloperTools: "never",
    mcp: { disabled: true },
    agent: { disabled: true },
    hideClientButton: true,
  }),
);

// 404 anything else
app.notFound((c) =>
  c.json({ error: "Route not found. Check https://api.the-finals-leaderboard.com for all available routes." }, 404),
);

export default {
  fetch: app.fetch,
  scheduled: (event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) => {
    // KV backup every 2 hours
    if (event.cron === "0 */2 * * *") {
      ctx.waitUntil(backupToKV(env.KV));
    }

    // D1 index every 4 hours
    if (event.cron === "0 */4 * * *") {
      ctx.waitUntil(indexLiveLeaderboardsToD1(env.DB, env.KV));
    }

    // R2 backup every 12 hours - used for AutoRAG
    if (event.cron === "30 */12 * * *") {
      ctx.waitUntil(backupToR2(env.KV, env.R2));
    }
  },
};

app.post("/backup-to-kv-via-workflow", authentication, async (c) => {
  await c.env.BACKUP_WORKFLOW.create();
});

// backs up all live leaderboards to KV
app.post("/backup-to-kv", authentication, (c) => backupToKV(c.env.KV));
// backs up all live leaderboards to R2, used for AutoRAG
app.post("/backup-to-r2", authentication, (c) => backupToR2(c.env.KV, c.env.R2));
// one-time index of every frozen leaderboard into D1
app.post("/backfill-old-leaderboards-to-d1", authentication, (c) => backfillOldLeaderboardsToD1(c.env.DB, c.env.KV));
// re-runs the same D1 index the 4h cron does, for a fresh snapshot on demand
app.post("/index-live-leaderboards-to-d1", authentication, (c) => indexLiveLeaderboardsToD1(c.env.DB, c.env.KV));

export { BackupWorkflow } from "./workflows/backup";
