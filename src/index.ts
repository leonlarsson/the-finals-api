import { Hono } from "hono";
import { cors } from "hono/cors";
import backup from "./handlers/backup";
import tflNotice from "./handlers/tflNotice";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import { cache } from "./middleware/cache";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Enable CORS for all routes
app.use("*", cors());

// Routes
app.get("/v1/leaderboard/:leaderboardVersion?/:platform?", cache("v1-leaderboard", 10), getLeaderboard);

// Redirect /the-finals to /v1/leaderboard/the-finals/crossplay
app.get("/the-finals", (c) => c.redirect("/v1/leaderboard/the-finals/crossplay"));

app.get("/tfl-notice", cache("tfl-notice", 1), tflNotice);

// app.get("/proxy", proxyUrl);

export default {
  fetch: app.fetch,
  scheduled: (_event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) => {
    ctx.waitUntil(backup(env.KV));
  },
};
