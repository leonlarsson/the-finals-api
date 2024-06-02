import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import proxyUrl from "./handlers/proxy/proxyUrl";

const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Cache for 10 minutes
app.get(
  "/v1/leaderboard/*",
  cache({
    cacheName: "v1-leaderboard",
    cacheControl: "public, max-age=600",
  })
);

app.get("/v1/leaderboard/:leaderboardVersion?/:platform?", getLeaderboard);
app.get("/proxy", proxyUrl);

export default app;
