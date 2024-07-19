import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "./middleware/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import get35Event from "./handlers/get35Event";
import proxyUrl from "./handlers/proxy/proxyUrl";

const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Routes
app.get(
  "/v1/leaderboard/:leaderboardVersion?/:platform?",
  cache("v1-leaderboard", 10),
  getLeaderboard
);

app.get("/35event", cache("35event", 10), get35Event);

app.get("/proxy", proxyUrl);

export default app;
