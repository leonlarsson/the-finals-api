import { closedBeta1Schema, closedBeta1UserSchema } from "../schemas/leaderboards/closedBeta1";
import { closedBeta2Schema, closedBeta2UserSchema } from "../schemas/leaderboards/closedBeta2";
import { openBetaSchema, openBetaUserSchema } from "../schemas/leaderboards/openBeta";
import { orfSchema, orfUserSchema } from "../schemas/leaderboards/orf";
import { season1Schema, season1UserSchema } from "../schemas/leaderboards/season1";
import { season2Schema, season2UserSchema } from "../schemas/leaderboards/season2";
import { season3Schema, season3UserSchema } from "../schemas/leaderboards/season3";
import { season3WorldTourSchema, season3WorldTourUserSchema } from "../schemas/leaderboards/season3WorldTour";
import { season4Schema, season4UserSchema } from "../schemas/leaderboards/season4";
import { season4SponsorSchema, season4SponsorUserSchema } from "../schemas/leaderboards/season4Sponsor";
import { season4WorldTourSchema, season4WorldTourUserSchema } from "../schemas/leaderboards/season4WorldTour";
import { season5Schema, season5UserSchema } from "../schemas/leaderboards/season5";
import { season5SponsorSchema, season5SponsorUserSchema } from "../schemas/leaderboards/season5Sponsor";
import { theFinalsSchema, theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { BaseAPIRoute } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import fetchOrfData from "../utils/fetchers/fetchOrfData";
import fetchS5Data from "../utils/fetchers/fetchS5Data";
import fetchS5SponsorData from "../utils/fetchers/fetchS5SponsorData";
import { getJsonFromKV } from "../utils/kv";

// 20_160 minutes is 14 days
const oldLeaderboardCacheMinutes = 20_160;

export const leaderboardApiRoutes: BaseAPIRoute[] = [
  {
    id: "cb1",
    legacyIds: ["closedbeta1"],
    availablePlatforms: [],
    metadata: {
      summary: "Closed Beta 1",
      description: "Get leaderboard data from the first closed beta of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv }) {
      return await getJsonFromKV(kv, `data_${this.id}`);
    },
    zodSchema: closedBeta1Schema,
    zodSchemaOpenApi: closedBeta1UserSchema,
  },
  {
    id: "cb2",
    legacyIds: ["closedbeta2"],
    availablePlatforms: [],
    metadata: {
      summary: "Closed Beta 2",
      description: "Get leaderboard data from the second closed beta of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv }) {
      return await getJsonFromKV(kv, `data_${this.id}`);
    },
    zodSchema: closedBeta2Schema,
    zodSchemaOpenApi: closedBeta2UserSchema,
  },
  {
    id: "ob",
    legacyIds: ["openbeta"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      summary: "Open Beta",
      description: "Get leaderboard data from the open beta of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: openBetaSchema,
    zodSchemaOpenApi: openBetaUserSchema,
  },
  {
    id: "s1",
    legacyIds: ["season1"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      summary: "Season 1",
      description: "Get leaderboard data from the first season of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season1Schema,
    zodSchemaOpenApi: season1UserSchema,
  },
  {
    id: "s2",
    // "live" was a horrible idea, but it's here now. It will remain on S2
    legacyIds: ["season2", "live"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      summary: "Season 2",
      description: "Get leaderboard data from the second season of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season2Schema,
    zodSchemaOpenApi: season2UserSchema,
  },
  {
    id: "s3",
    legacyIds: ["season3"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3",
      description: "Get leaderboard data from the third season of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season3Schema,
    zodSchemaOpenApi: season3UserSchema,
  },
  {
    id: "s3original",
    legacyIds: ["season3original"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3 - Original",
      description: "Get leaderboard data from the third season of THE FINALS. Pre-purge.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season3Schema,
    zodSchemaOpenApi: season3UserSchema,
  },
  {
    id: "s3worldtour",
    legacyIds: ["season3worldtour"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3 World Tour",
      description: "Get leaderboard data from the third season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season3WorldTourSchema,
    zodSchemaOpenApi: season3WorldTourUserSchema,
  },
  {
    id: "s4",
    legacyIds: ["season4"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4",
      description: "Get leaderboard data from the fourth season of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season4Schema,
    zodSchemaOpenApi: season4UserSchema,
  },
  {
    id: "s4worldtour",
    legacyIds: ["season4worldtour"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4 World Tour",
      description: "Get leaderboard data from the fourth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season4WorldTourSchema,
    zodSchemaOpenApi: season4WorldTourUserSchema,
  },
  {
    id: "s4sponsor",
    legacyIds: ["season4sponsor"],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4 Sponsor",
      description: "Get leaderboard data from the fourth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: season4SponsorSchema,
    zodSchemaOpenApi: season4SponsorUserSchema,
  },

  {
    id: "s5",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 5",
      description: "Get leaderboard data from the fifth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5Data, kv, `backup_${this.id}_${platform}`);
    },
    zodSchema: season5Schema,
    zodSchemaOpenApi: season5UserSchema,
  },
  {
    id: "s5sponsor",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 5 Sponsor",
      description: "Get leaderboard data from the fifth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5Data, kv, `backup_${this.id}_${platform}`);
    },
    zodSchema: season5SponsorSchema,
    zodSchemaOpenApi: season5SponsorUserSchema,
  },

  // Special leaderboards. Any non-main leaderboards such as events
  {
    id: "the-finals",
    legacyIds: [],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "THE FINALS",
      description: "Get leaderboard data from the 'The Finals'.",
      tags: ["Leaderboards - Special"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchema: theFinalsSchema,
    zodSchemaOpenApi: theFinalsUserSchema,
  },
  {
    id: "orf",
    legacyIds: [],
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "ÖRF",
      description: "Get leaderboard data from the ÖRF leaderboard.",
      tags: ["Leaderboards - Special"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchOrfData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchema: orfSchema,
    zodSchemaOpenApi: orfUserSchema,
  },
] satisfies BaseAPIRoute[];
