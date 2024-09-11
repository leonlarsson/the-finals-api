import { ZodSchema } from "zod";
import { ClosedBeta1User } from "./transformers/closedBeta1";
import { ClosedBeta2User } from "./transformers/closedBeta2";
import { OpenBetaUser } from "./transformers/openBeta";
import { Season1User } from "./transformers/season1";
import { Season2User } from "./transformers/season2";
import { Season3User } from "./transformers/season3";

// The LeaderboardId
// One per leaderboard API version
export type LeaderboardVersion =
  | "cb1"
  | "cb2"
  | "ob"
  | "s1"
  | "s2"
  | "s3"
  | "s3worldtour";

// The LeaderboardAPIVersionParam
// This is the version parameter of the /leaderboard endpoint
// One leaderboard API version can have multiple versions params
export type LeaderboardAPIVersionParam =
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
  | "s3worldtour"
  | "season3worldtour"
  | "live";

// The LeaderboardAPIPlatformParam
// This is the platform parameter of the /leaderboard endpoint
// One leaderboard API version can have multiple platform params
export type LeaderboardAPIPlatformParam =
  | "crossplay"
  | "steam"
  | "xbox"
  | "psn";

type LeaderboardAPIRouteFetchDataSettings = {
  kv: KVNamespace;
  platform: LeaderboardAPIPlatformParam;
};

export type LeaderboardAPIRoute = {
  leaderboardVersion: LeaderboardVersion;
  params: {
    versions: LeaderboardAPIVersionParam[];
    platforms: LeaderboardAPIPlatformParam[];
  };
  fetchData: (
    fetchSettings: LeaderboardAPIRouteFetchDataSettings
  ) => Promise<unknown>;
  zodSchema: ZodSchema;
};

export type FameLeague = {
  fame: number;
  name: string;
};

export type User =
  | ClosedBeta1User
  | ClosedBeta2User
  | OpenBetaUser
  | Season1User
  | Season2User
  | Season3User;
