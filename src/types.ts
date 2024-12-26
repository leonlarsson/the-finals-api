import type { ZodSchema } from "zod";

interface CloudflareBindings {
  KV: KVNamespace;
  BACKUP_WORKFLOW: Workflow;
  AUTH_TOKEN: string;
}

export type Env = {
  Bindings: CloudflareBindings;
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
    /** The amount of minutes to cache the route using the cache middleware. Defaults to whatever value is set on the route level. */
    cacheMinutes?: number;
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

/** Base properties that exists in all users. */
export type BaseUser = {
  name: string;
  steamName: string;
  psnName: string;
  xboxName: string;
};

export type Tags =
  | "Leaderboards"
  | "Leaderboards - Special"
  | "Community Events"
  | "Clubs"
  | "the-finals-leaderboard.com";
