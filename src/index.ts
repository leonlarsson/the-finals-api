import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import proxyUrl from "./handlers/proxy/proxyUrl";
import get210Event from "./handlers/get210Event";

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

// Cache for 30 minutes
app.get(
  "/210event",
  cache({
    cacheName: "210event",
    cacheControl: "public, max-age=1800",
  })
);

// Routes
app.get("/v1/leaderboard/:leaderboardVersion?/:platform?", getLeaderboard);
app.get("/proxy", proxyUrl);
app.get("/210event", get210Event);

export default app;
