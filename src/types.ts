import type { ZodSchema } from "zod";
import type { ClosedBeta1User } from "./schemas/leaderboards/closedBeta1";
import type { ClosedBeta2User } from "./schemas/leaderboards/closedBeta2";
import type { OpenBetaUser } from "./schemas/leaderboards/openBeta";
import type { OrfUser } from "./schemas/leaderboards/orf";
import type { Season1User } from "./schemas/leaderboards/season1";
import type { Season2User } from "./schemas/leaderboards/season2";
import type { Season3User } from "./schemas/leaderboards/season3";
import type { Season3WorldTourUser } from "./schemas/leaderboards/season3WorldTour";
import type { Season4User } from "./schemas/leaderboards/season4";
import type { Season4SponsorUser } from "./schemas/leaderboards/season4Sponsor";
import type { Season4WorldTourUser } from "./schemas/leaderboards/season4WorldTour";
import type { TheFinalsUser } from "./schemas/leaderboards/theFinals";

// The LeaderboardId
// One per leaderboard API version
export type LeaderboardVersion =
  | "cb1"
  | "cb2"
  | "ob"
  | "s1"
  | "s2"
  | "s3"
  | "s3original"
  | "s3worldtour"
  | "s4"
  | "s4worldtour"
  | "s4sponsor"
  // Specials
  | "the-finals"
  | "orf";

// The LeaderboardPlatforms
// This is the platform parameter of the /leaderboard endpoint
// One leaderboard API version can have multiple platform params
export type LeaderboardPlatforms = "crossplay" | "steam" | "xbox" | "psn";

type LeaderboardAPIRouteFetchDataSettings = {
  kv: KVNamespace;
  platform: LeaderboardPlatforms;
};

export type LeaderboardAPIRoute = {
  type: "leaderboard" | "special";
  leaderboardVersion: LeaderboardVersion;
  leaderboardVersionAliases: string[];
  availablePlatforms: LeaderboardPlatforms[];
  metadata: {
    title: string;
    description: string;
  };
  includeInBackup?: boolean;
  fetchData: (fetchSettings: LeaderboardAPIRouteFetchDataSettings) => Promise<unknown>;
  zodSchema: ZodSchema;
  zodSchemaOpenApi: ZodSchema;
};

export type FameLeague = {
  fame: number;
  name: string;
};

/** User consists of all the different user structures from leaderboards. */
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
  | Season4SponsorUser
  | TheFinalsUser
  | OrfUser;
