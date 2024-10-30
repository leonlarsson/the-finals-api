import type { ZodSchema } from "zod";

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

/** Base properties that exists in all users. */
export type BaseUser = {
  name: string;
  steamName: string;
  psnName: string;
  xboxName: string;
};

export type Tags = "Leaderboards" | "Leaderboards - Special" | "Community Events" | "the-finals-leaderboard.com";
