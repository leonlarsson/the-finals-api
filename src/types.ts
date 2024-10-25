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

export interface CloudflareBindings {
  KV: KVNamespace;
  AUTH_TOKEN: string;
}

// The LeaderboardPlatforms
// This is the platform parameter of the /leaderboard endpoint
// One leaderboard API version can have multiple platform params
export type LeaderboardPlatforms = "crossplay" | "steam" | "xbox" | "psn";

type LeaderboardAPIRouteFetchDataSettings = {
  kv: KVNamespace;
  platform: LeaderboardPlatforms;
};

export interface BaseAPIRoute {
  id: string;
  legacyIds?: string[];
  availablePlatforms: LeaderboardPlatforms[];
  metadata: {
    summary: string;
    description: string;
    tags: Tags[];
  };
  includeInBackup?: boolean;
  fetchData: (fetchSettings: LeaderboardAPIRouteFetchDataSettings) => Promise<unknown>;
  zodSchema: ZodSchema;
  zodSchemaOpenApi: ZodSchema;
}

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

export type Tags = "Leaderboards" | "Leaderboards - Special" | "Community Events" | "the-finals-leaderboard.com";
