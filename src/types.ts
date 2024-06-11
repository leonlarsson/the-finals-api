export type LeaderboardVersion = "cb1" | "cb2" | "ob" | "s1" | "s2" | "s3";
export type APIVersionParam =
  | "cb1"
  | "closedbeta1"
  | "cb2"
  | "closedbeta2"
  | "ob"
  | "openbeta"
  | "s1"
  | "season1"
  | "s2"
  | "season2"
  | "s3"
  | "season3"
  | "live";
export type APIPlatformParam = "crossplay" | "steam" | "xbox" | "psn";
export type APIRoute = {
  leaderboardVersion: LeaderboardVersion;
  params: {
    versions: APIVersionParam[];
    platforms: APIPlatformParam[];
  };
  fetchData: (platform: APIPlatformParam) => Promise<RawUser[] | null>;
};

export type RawUser = {
  /** The user's rank. */
  r: number;
  /** The user's rank number Maps to a league. Only in Season 2. */
  ri?: number;
  /** The user's name. */
  name: string;
  /** The user's fame. */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** The user's change in rank. */
  or: number;
  /** The user's cashouts. */
  c: number;
  /** The user's XP. Available in versions 1 and 2. */
  x?: number;
  /** The user's level. Available in versions 1 and 2. */
  mx?: number;
  /** The user's Steam name. */
  steam?: string;
  /** The user's Xbox name. */
  xbox?: string;
  /** The user's PSN name. */
  psn?: string;
};

export type User = {
  rank: number;
  leagueNumber?: number;
  league: string;
  change: number;
  name: string;
  steamName?: string;
  xboxName?: string;
  psnName?: string;
  xp?: number;
  level?: number;
  cashouts: number;
  fame: number;
};

export type FameLeague = {
  fame: number;
  name: string;
};
