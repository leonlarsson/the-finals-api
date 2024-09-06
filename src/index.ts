import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings } from "./types";
import { cache } from "./middleware/cache";
import getLeaderboard from "./handlers/v1/getLeaderboard";
import proxyUrl from "./handlers/proxy/proxyUrl";
import fetchTheFinalsData from "./utils/fetchers/fetchTheFinalsData";
import fetchCe311 from "./utils/fetchers/fetchCe311";
import tflNotice from "./handlers/tflNotice";

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes
app.use("*", cors());

// Routes
app.get(
  "/v1/leaderboard/:leaderboardVersion?/:platform?",
  cache("v1-leaderboard", 10),
  getLeaderboard
);

app.get("/the-finals", cache("the-finals", 10), fetchTheFinalsData);
app.get("/ce311", cache("ce311", 10), fetchCe311);

app.get("/tfl-notice", cache("tfl-notice", 1), tflNotice);

app.get("/proxy", proxyUrl);

export default app;
