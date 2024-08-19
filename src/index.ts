import { Hono } from "hono";
import { cors } from "hono/cors";
import { cache } from "./middleware/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import getTheFinals from "./handlers/getTheFinals";
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

app.get("/the-finals", cache("the-finals", 10), getTheFinals);

app.get("/proxy", proxyUrl);

export default app;
