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

export type User = {
  rank: number;
  leagueNumber?: number;
  league: string;
  change: number;
  name: string;
  steamName: string;
  xboxName: string;
  psnName: string;
  xp?: number;
  level?: number;
  cashouts?: number;
  fame?: number;
};

export type RawUser =
  | ClosedBeta1RawUser
  | ClosedBeta2RawUser
  | OpenBetaRawUser
  | Season1RawUser
  | Season2RawUser;

export type ClosedBeta1RawUser = {
  /** Rank */
  r: number;
  /** Name */
  name: string;
  /** Fame */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** Old rank */
  or: number;
  /** XP */
  x: number;
  /** Level */
  mx: number;
  /** Cashouts */
  c: number;
};

export type ClosedBeta2RawUser = {
  /** Rank */
  r: number;
  /** Name */
  name: string;
  /** Fame */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** Old rank */
  or: number;
  /** XP */
  x: number;
  /** Level */
  mx: number;
  /** Cashouts */
  c: number;
};

export type OpenBetaRawUser = {
  /** Rank */
  r: number;
  /** Name */
  name: string;
  /** Fame */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** Old rank */
  or: number;
  /** Cashouts */
  c: number;
  /** Steam name */
  steam: string;
  /** Xbox name */
  xbox: string;
  /** PSN name */
  psn: string;
};

export type Season1RawUser = {
  /** Rank */
  r: number;
  /** Name */
  name: string;
  /** Fame */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** Old rank */
  or: number;
  /** Cashouts */
  c: number;
  /** Steam name */
  steam: string;
  /** Xbox name */
  xbox: string;
  /** PSN name */
  psn: string;
};

export type Season2RawUser = {
  /** Rank */
  r: number;
  /** Name */
  name: string;
  /** Rank Index */
  ri: number;
  /** No idea */
  p: number;
  /** Old rank index? */
  ori: number;
  /** Old rank */
  or: number;
  /** No idea old */
  op: number;
  /** Cashouts but empty */
  c: number;
  /** Steam name */
  steam: string;
  /** Xbox name */
  xbox: string;
  /** PSN name */
  psn: string;
};
