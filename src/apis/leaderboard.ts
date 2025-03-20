import { closedBeta1UserSchema } from "../schemas/leaderboards/closedBeta1";
import { closedBeta2UserSchema } from "../schemas/leaderboards/closedBeta2";
import { openBetaUserSchema } from "../schemas/leaderboards/openBeta";
import { orfUserSchema } from "../schemas/leaderboards/orf";
import { season1UserSchema } from "../schemas/leaderboards/season1";
import { season2UserSchema } from "../schemas/leaderboards/season2";
import { season3UserSchema } from "../schemas/leaderboards/season3";
import { season3WorldTourUserSchema } from "../schemas/leaderboards/season3WorldTour";
import { season4UserSchema } from "../schemas/leaderboards/season4";
import { season4SponsorUserSchema } from "../schemas/leaderboards/season4Sponsor";
import { season4WorldTourUserSchema } from "../schemas/leaderboards/season4WorldTour";
import { season5UserSchema } from "../schemas/leaderboards/season5";
import { season5BankItUserSchema } from "../schemas/leaderboards/season5BankIt";
import { season5PowerShiftUserSchema } from "../schemas/leaderboards/season5PowerShift";
import { season5QuickQashUserSchema } from "../schemas/leaderboards/season5QuickCash";
import { season5SponsorUserSchema } from "../schemas/leaderboards/season5Sponsor";
import { season5TerminalAttackUserSchema } from "../schemas/leaderboards/season5TerminalAttack";
import { season5WorldTourUserSchema } from "../schemas/leaderboards/season5WorldTour";
import { season6UserSchema } from "../schemas/leaderboards/season6";
import { season6PowerShiftUserSchema } from "../schemas/leaderboards/season6PowerShift";
import { season6QuickQashUserSchema } from "../schemas/leaderboards/season6QuickCash";
import { season6SponsorUserSchema } from "../schemas/leaderboards/season6Sponsor";
import { season6TeamDeathmatchUserSchema } from "../schemas/leaderboards/season6TeamDeathmatch";
import { season6TerminalAttackUserSchema } from "../schemas/leaderboards/season6TerminalAttack";
import { season6WorldTourUserSchema } from "../schemas/leaderboards/season6WorldTour";
import { theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { BaseAPIRoute } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import { getJsonFromKV } from "../utils/kv";
import { embarkApi, fetchStandardEmbarkLeaderboardData } from "./embarkApi";

// 20_160 minutes is 14 days
const oldLeaderboardCacheMinutes = 20_160;

export const leaderboardApiRoutes: BaseAPIRoute[] = [
  // CLOSED BETA 1
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

  // CLOSED BETA 2
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

  // OPEN BETA
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

  // SEASON 1
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

  // SEASON 2
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

  // SEASON 3
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

  // SEASON 4
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

  // SEASON 5
  {
    id: "s5",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5",
      description: "Get leaderboard data from the fifth season of THE FINALS.",
      tags: ["Leaderboards"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
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
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async function ({ kv, platform }) {
      return await getJsonFromKV(kv, `data_${this.id}_${platform}`);
    },
    zodSchemaOpenApi: season5BankItUserSchema,
  },

  // SEASON 6
  {
    id: "s6",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6",
      description: "Get leaderboard data from the sixth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6UserSchema,
  },
  {
    id: "s6sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Sponsor",
      description: "Get leaderboard data from the sixth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6Sponsor),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6SponsorUserSchema,
  },
  {
    id: "s6worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 World Tour",
      description: "Get leaderboard data from the sixth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6WorldTour),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6WorldTourUserSchema,
  },
  {
    id: "s6terminalattack",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Terminal Attack",
      description: "Get leaderboard data from the sixth season of THE FINALS - Terminal Attack.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6TerminalAttack),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6TerminalAttackUserSchema,
  },
  {
    id: "s6powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 PowerShift",
      description: "Get leaderboard data from the sixth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6PowerShift),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6PowerShiftUserSchema,
  },
  {
    id: "s6quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Quick Cash",
      description: "Get leaderboard data from the sixth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6QuickCash),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6QuickQashUserSchema,
  },
  {
    id: "s6teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Team Deathmatch",
      description: "Get leaderboard data from the sixth season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    includeInBackup: true,
    fetchData: async function ({ kv, platform }) {
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.season6TeamDeathmatch),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: season6TeamDeathmatchUserSchema,
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
      return fetchWithKVFallback(
        () => fetchStandardEmbarkLeaderboardData(embarkApi.orf),
        kv,
        `backup_${this.id}_${platform}`,
      );
    },
    zodSchemaOpenApi: orfUserSchema,
  },
] satisfies BaseAPIRoute[];
