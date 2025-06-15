import type { ZodSchema } from "zod";

interface CloudflareEnv extends CloudflareBindings {
  AUTH_TOKEN: string;
}

export type HonoEnv = {
  Bindings: CloudflareEnv;
  Variables: {
    leaderboardDataSource: "fetch" | "kv" | "backup";
  };
};

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
  hasClubData?: boolean;
  metadata: {
    summary: string;
    description: string;
    tags: Tags[];
  };
  /** The amount of minutes to cache the route using the cache middleware. Defaults to whatever value is set on the route level. */
  cacheMinutes?: number;
  /** Where to store backups. */
  backups?: {
    kv?: boolean;
    r2?: boolean;
  };
  fetchData: (fetchSettings: LeaderboardAPIRouteFetchDataSettings) => Promise<unknown>;
  zodSchemaOpenApi: ZodSchema;
}

export type FameLeague = {
  fame: number;
  name: string;
};

/** Base properties that exists in all users. */
export type BaseUser = {
  name: string;
  steamName: string;
  psnName: string;
  xboxName: string;
};

/** Base properties that exists in all club users. */
export type ClubBaseUser = {
  name: string;
  steamName: string;
  psnName: string;
  xboxName: string;
  clubTag: string;
  rankScore?: number;
  fans?: number;
  cashouts?: number;
  points?: number;
};

export type Tags =
  | "Leaderboards"
  | "Leaderboards - Special"
  | "Community Events"
  | "Clubs"
  | "the-finals-leaderboard.com";
