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
import { season5BankItSchema, season5BankItUserSchema } from "../schemas/leaderboards/season5BankIt";
import { season5PowerShiftSchema, season5PowerShiftUserSchema } from "../schemas/leaderboards/season5PowerShift";
import { season5QuickQashSchema, season5QuickQashUserSchema } from "../schemas/leaderboards/season5QuickCash";
import { season5SponsorSchema, season5SponsorUserSchema } from "../schemas/leaderboards/season5Sponsor";
import {
  season5TerminalAttackSchema,
  season5TerminalAttackUserSchema,
} from "../schemas/leaderboards/season5TerminalAttack";
import { season5WorldTourSchema, season5WorldTourUserSchema } from "../schemas/leaderboards/season5WorldTour";
import { theFinalsSchema, theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { BaseAPIRoute } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import fetchOrfData from "../utils/fetchers/fetchOrfData";
import fetchS5BankitData from "../utils/fetchers/fetchS5BankitData";
import fetchS5Data from "../utils/fetchers/fetchS5Data";
import fetchS5PowerShiftData from "../utils/fetchers/fetchS5PowerShiftData";
import fetchS5QuickCashData from "../utils/fetchers/fetchS5QuickCashData";
import fetchS5SponsorData from "../utils/fetchers/fetchS5SponsorData";
import fetchS5TerminalAttackData from "../utils/fetchers/fetchS5TerminalAttackData";
import fetchS5WorldTourData from "../utils/fetchers/fetchS5WorldTourData";
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
    zodSchemaOpenApi: season4SponsorUserSchema,
  },

  {
    id: "s5",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5",
      description: "Get leaderboard data from the fifth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5Data, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5UserSchema,
  },
  {
    id: "s5sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Sponsor",
      description: "Get leaderboard data from the fifth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5SponsorData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5SponsorUserSchema,
  },
  {
    id: "s5worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 World Tour",
      description: "Get leaderboard data from the fifth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5WorldTourData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5WorldTourUserSchema,
  },
  {
    id: "s5terminalattack",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Terminal Attack",
      description: "Get leaderboard data from the fifth season of THE FINALS - Terminal Attack.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5TerminalAttackData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5TerminalAttackUserSchema,
  },
  {
    id: "s5powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 PowerShift",
      description: "Get leaderboard data from the fifth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5PowerShiftData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5PowerShiftUserSchema,
  },
  {
    id: "s5quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Quick Cash",
      description: "Get leaderboard data from the fifth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5QuickCashData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5QuickQashUserSchema,
  },
  {
    id: "s5bankit",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Bank It",
      description: "Get leaderboard data from the fifth season of THE FINALS - Bank It.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(fetchS5BankitData, kv, `backup_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5BankItUserSchema,
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
    zodSchemaOpenApi: orfUserSchema,
  },
] satisfies BaseAPIRoute[];
