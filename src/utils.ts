import { RawUser, User } from "./types";

export const transformApiData = (data: RawUser[]): User[] =>
  data.map(user => ({
    rank: user.r,
    change: user.or - user.r,
    leagueNumber: user.ri,
    league: user.ri ? numberToLeague(user.ri) : undefined,
    name: user.name,
    steamName: user.steam,
    xboxName: user.xbox,
    psnName: user.psn,
    xp: user.x,
    level: user.mx,
    cashouts: user.c,
    fame: user.f,
  }));

const numberToLeague = (leagueNumber: number) => {
  // Borrowed from https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-live.js/main.js?v2
  const leagueMap: Record<number, string> = {
    0: "Unranked",
    1: "Bronze 4",
    2: "Bronze 3",
    3: "Bronze 2",
    4: "Bronze 1",
    5: "Silver 4",
    6: "Silver 3",
    7: "Silver 2",
    8: "Silver 1",
    9: "Gold 4",
    10: "Gold 3",
    11: "Gold 2",
    12: "Gold 1",
    13: "Platinum 4",
    14: "Platinum 3",
    15: "Platinum 2",
    16: "Platinum 1",
    17: "Diamond 4",
    18: "Diamond 3",
    19: "Diamond 2",
    20: "Diamond 1",
  };

  return leagueMap[leagueNumber];
};
