import { getContext } from "hono/context-storage";
import type { Env } from "../types";

const context = () => getContext<Env>();

/** Get the source of the leaderboard data */
export const getSource = () => context().get("leaderboardDataSource");

/** Data came from a fetch to Embark */
export const setSourceToFetch = () => {
  context().set("leaderboardDataSource", "fetch");
};

/** Data came from KV */
export const setSourceToKV = () => {
  context().set("leaderboardDataSource", "kv");
};

/** Data came from a KV backup because a fetch failed */
export const setSourceToBackup = () => {
  context().set("leaderboardDataSource", "backup");
};
