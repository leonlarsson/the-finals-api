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
    leagueNumber: user.ri,
    // If the user has a league number, use that to determine the league
    // Otherwise, use the fame to determine the league
    league: user.ri
      ? leagueNumberToName(user.ri)
      : fameToLeague(leaderboardVersion, user.f),
    name: user.name,
    steamName: user.steam,
    xboxName: user.xbox,
    psnName: user.psn,
    xp: user.x,
    level: user.mx,
    cashouts: user.c,
    fame: user.f,
  }));
