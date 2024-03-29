import { Hono } from "hono";
import { cache } from "hono/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";

const app = new Hono();

// Cache for 10 minutes
app.get(
  "/v1/leaderboard/*",
  cache({
    cacheName: "v1-leaderboard",
    cacheControl: "public, max-age=600",
  })
);

app.get("/v1/leaderboard/:leaderboardVersion?/:platform?", getLeaderboard);

export default app;
