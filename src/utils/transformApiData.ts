import { LeaderboardVersion, RawUser, User } from "../types";
import fameToLeague from "./fameToLeague";
import leagueNumberToName from "./leagueNumberToName";

// Transforms raw user data from the API into a more readable format
export default (
  leaderboardVersion: LeaderboardVersion,
  data: RawUser[]
): User[] =>
  data.map(user => ({
    rank: user.r,
    change: user.or - user.r,
    leagueNumber: "ri" in user ? user.ri : undefined,
    league:
      "ri" in user
        ? leagueNumberToName(user.ri)
        : "f" in user
        ? fameToLeague(leaderboardVersion, user.f)
        : "N/A",
    name: user.name,
    steamName: "steam" in user ? user.steam : "",
    xboxName: "xbox" in user ? user.xbox : "",
    psnName: "psn" in user ? user.psn : "",
    xp: "x" in user ? user.x : undefined,
    level: "mx" in user ? user.mx : undefined,
    cashouts: "c" in user ? user.c : undefined,
    fame: "f" in user ? user.f : undefined,
    rankScore:
      leaderboardVersion === "s3"
        ? "p" in user
          ? user.p
          : undefined
        : undefined,
  }));
