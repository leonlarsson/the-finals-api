import type { LeaderboardVersion } from "../types";
import leagues from "./leagues";

// Returns the league name for a given fame value in a given leaderboard version
export default (leaderboard: LeaderboardVersion, fame: number): string =>
  leagues[leaderboard].toSorted((a, b) => b.fame - a.fame).find((x) => fame >= x.fame)?.name ?? "Unknown";
