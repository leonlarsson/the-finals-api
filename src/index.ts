import { Hono } from "hono";
import getLeaderboard from "./handlers/v1/getLeaderboard";

const app = new Hono();

app.get("/v1/leaderboard/:version/:platform?", getLeaderboard);

export default app;
