import type { ZodSchema } from "zod";
import type { ClosedBeta1User } from "./transformers/closedBeta1";
import type { ClosedBeta2User } from "./transformers/closedBeta2";
import type { OpenBetaUser } from "./transformers/openBeta";
import type { Season1User } from "./transformers/season1";
import type { Season2User } from "./transformers/season2";
import type { Season3User } from "./transformers/season3";
import type { Season3WorldTourUser } from "./transformers/season3WorldTour";
import type { Season4User } from "./transformers/season4";
import type { Season4SponsorUser } from "./transformers/season4Sponsor";
import type { Season4WorldTourUser } from "./transformers/season4WorldTour";

// The LeaderboardId
// One per leaderboard API version
export type LeaderboardVersion =
  | "cb1"
  | "cb2"
  | "ob"
  | "s1"
  | "s2"
  | "s3"
  | "s3worldtour"
  | "s4"
  | "s4worldtour"
  | "s4sponsor"
  // Specials
  | "the-finals"
  | "orf";

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
  | "s4"
  | "season4"
  | "s4worldtour"
  | "season4worldtour"
  | "s4sponsor"
  | "season4sponsor"
  | "live"
  // Specials
  | "the-finals"
  | "orf";

// The LeaderboardAPIPlatformParam
// This is the platform parameter of the /leaderboard endpoint
// One leaderboard API version can have multiple platform params
export type LeaderboardAPIPlatformParam = "crossplay" | "steam" | "xbox" | "psn";

type LeaderboardAPIRouteFetchDataSettings = {
  kv: KVNamespace;
  platform: LeaderboardAPIPlatformParam;
};

export type LeaderboardAPIRoute = {
  type: "leaderboard" | "special";
  leaderboardVersion: LeaderboardVersion;
  params: {
    versions: LeaderboardAPIVersionParam[];
    platforms: LeaderboardAPIPlatformParam[];
  };
  includeInBackup?: boolean;
  fetchData: (fetchSettings: LeaderboardAPIRouteFetchDataSettings) => Promise<unknown>;
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
  | Season3User
  | Season3WorldTourUser
  | Season4User
  | Season4WorldTourUser
  | Season4SponsorUser;
