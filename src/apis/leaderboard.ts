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
import { season6HeavyHittersUserSchema } from "../schemas/leaderboards/season6HeavyHitters";
import { season6PowerShiftUserSchema } from "../schemas/leaderboards/season6PowerShift";
import { season6QuickQashUserSchema } from "../schemas/leaderboards/season6QuickCash";
import { season6SponsorUserSchema } from "../schemas/leaderboards/season6Sponsor";
import { season6TeamDeathmatchUserSchema } from "../schemas/leaderboards/season6TeamDeathmatch";
import { season6TerminalAttackUserSchema } from "../schemas/leaderboards/season6TerminalAttack";
import { season6WorldTourUserSchema } from "../schemas/leaderboards/season6WorldTour";
import { season7UserSchema } from "../schemas/leaderboards/season7";
import { season7BlastOffUserSchema } from "../schemas/leaderboards/season7BlastOff";
import { season7PowerShiftUserSchema } from "../schemas/leaderboards/season7PowerShift";
import { season7QuickQashUserSchema } from "../schemas/leaderboards/season7QuickCash";
import { season7SponsorUserSchema } from "../schemas/leaderboards/season7Sponsor";
import { season7TeamDeathmatchUserSchema } from "../schemas/leaderboards/season7TeamDeathmatch";
import { season7TerminalAttackUserSchema } from "../schemas/leaderboards/season7TerminalAttack";
import { season7WorldTourUserSchema } from "../schemas/leaderboards/season7WorldTour";
import { theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { BaseAPIRoute, LeaderboardPlatforms } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import { getJsonFromKV } from "../utils/kv";
import { type EmbarkApi, cachedFetchStandardEmbarkLeaderboardData, embarkApi } from "./embarkApi";

const allPlatforms: LeaderboardPlatforms[] = ["crossplay", "steam", "xbox", "psn"];

// 20_160 minutes is 14 days
const oldLeaderboardCacheMinutes = 20_160;
const liveLeaderboardCacheMinutes = 10;

type PartialLeaderboardWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type CreateLeaderboardData = PartialLeaderboardWithRequired<
  BaseAPIRoute,
  // Required properties
  "id" | "availablePlatforms" | "metadata" | "zodSchemaOpenApi"
>;

/** createOldLeaderboard creates a leaderboard API route with the old cache settings and fetchData function that retrieves data from KV. No backups. */
const createOldLeaderboard = (data: CreateLeaderboardData): BaseAPIRoute => {
  return {
    cacheMinutes: oldLeaderboardCacheMinutes,
    backups: {},
    fetchData: async function ({ kv, platform }) {
      return getJsonFromKV(kv, platform ? `data_${this.id}_${platform}` : `data_${this.id}`);
    },
    ...data,
  };
};

/** createLiveLeaderboard creates a leaderboard API route with the live cache settings and fetchData function that retrieves data from the provided `embarkApi` with a fall back to KV. All backups enabled. */
const createLiveLeaderboard = (data: CreateLeaderboardData, embarkApi: EmbarkApi): BaseAPIRoute => {
  return {
    cacheMinutes: liveLeaderboardCacheMinutes,
    backups: {
      kv: true,
      r2: true,
    },
    fetchData: async function ({ ctx, kv, platform }) {
      return fetchWithKVFallback(
        () => cachedFetchStandardEmbarkLeaderboardData(embarkApi, kv, this.cacheMinutes * 60, ctx),
        kv,
        platform ? `backup_${this.id}_${platform}` : `backup_${this.id}`,
      );
    },
    ...data,
  };
};

export const leaderboardApiRoutes: BaseAPIRoute[] = [
  // CLOSED BETA 1
  createOldLeaderboard({
    id: "cb1",
    availablePlatforms: [],
    metadata: {
      summary: "Closed Beta 1",
      description: "Get leaderboard data from the first closed beta of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: closedBeta1UserSchema,
  }),

  // CLOSED BETA 2
  createOldLeaderboard({
    id: "cb2",
    availablePlatforms: [],
    metadata: {
      summary: "Closed Beta 2",
      description: "Get leaderboard data from the second closed beta of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: closedBeta2UserSchema,
  }),

  // OPEN BETA
  createOldLeaderboard({
    id: "ob",
    availablePlatforms: allPlatforms,
    metadata: {
      summary: "Open Beta",
      description: "Get leaderboard data from the open beta of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: openBetaUserSchema,
  }),

  // SEASON 1
  createOldLeaderboard({
    id: "s1",
    availablePlatforms: allPlatforms,
    metadata: {
      summary: "Season 1",
      description: "Get leaderboard data from the first season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season1UserSchema,
  }),

  // SEASON 2
  createOldLeaderboard({
    id: "s2",
    // "live" was a horrible idea, but it's here now. It will remain on S2
    availablePlatforms: allPlatforms,
    metadata: {
      summary: "Season 2",
      description: "Get leaderboard data from the second season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season2UserSchema,
  }),

  // SEASON 3
  createOldLeaderboard({
    id: "s3",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3",
      description: "Get leaderboard data from the third season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season3UserSchema,
  }),
  createOldLeaderboard({
    id: "s3original",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3 - Original",
      description: "Get leaderboard data from the third season of THE FINALS. Pre-purge.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season3UserSchema,
  }),
  createOldLeaderboard({
    id: "s3worldtour",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 3 World Tour",
      description: "Get leaderboard data from the third season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season3WorldTourUserSchema,
  }),

  // SEASON 4
  createOldLeaderboard({
    id: "s4",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4",
      description: "Get leaderboard data from the fourth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season4UserSchema,
  }),
  createOldLeaderboard({
    id: "s4worldtour",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4 World Tour",
      description: "Get leaderboard data from the fourth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season4WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s4sponsor",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "Season 4 Sponsor",
      description: "Get leaderboard data from the fourth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season4SponsorUserSchema,
  }),

  // SEASON 5
  createOldLeaderboard({
    id: "s5",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5",
      description: "Get leaderboard data from the fifth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5UserSchema,
  }),
  createOldLeaderboard({
    id: "s5sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Sponsor",
      description: "Get leaderboard data from the fifth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s5worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 World Tour",
      description: "Get leaderboard data from the fifth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s5terminalattack",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Terminal Attack",
      description: "Get leaderboard data from the fifth season of THE FINALS - Terminal Attack.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5TerminalAttackUserSchema,
  }),
  createOldLeaderboard({
    id: "s5powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 PowerShift",
      description: "Get leaderboard data from the fifth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s5quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Quick Cash",
      description: "Get leaderboard data from the fifth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5QuickQashUserSchema,
  }),
  createOldLeaderboard({
    id: "s5bankit",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 5 Bank It",
      description: "Get leaderboard data from the fifth season of THE FINALS - Bank It.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season5BankItUserSchema,
  }),

  // SEASON 6
  createOldLeaderboard({
    id: "s6",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6",
      description: "Get leaderboard data from the sixth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6UserSchema,
  }),
  createOldLeaderboard({
    id: "s6sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Sponsor",
      description: "Get leaderboard data from the sixth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s6worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 World Tour",
      description: "Get leaderboard data from the sixth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s6terminalattack",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Terminal Attack",
      description: "Get leaderboard data from the sixth season of THE FINALS - Terminal Attack.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6TerminalAttackUserSchema,
  }),
  createOldLeaderboard({
    id: "s6powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 PowerShift",
      description: "Get leaderboard data from the sixth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s6quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Quick Cash",
      description: "Get leaderboard data from the sixth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6QuickQashUserSchema,
  }),
  createOldLeaderboard({
    id: "s6teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Team Deathmatch",
      description: "Get leaderboard data from the sixth season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6TeamDeathmatchUserSchema,
  }),
  createOldLeaderboard({
    id: "s6heavyhitters",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 6 Heavy Hitters",
      description: "Get leaderboard data from the sixth season of THE FINALS - Heavy Hitters.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season6HeavyHittersUserSchema,
  }),

  // SEASON 7
  createLiveLeaderboard(
    {
      id: "s7",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7",
        description: "Get leaderboard data from the seventh season of THE FINALS.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7UserSchema,
    },
    embarkApi.season7,
  ),
  createLiveLeaderboard(
    {
      id: "s7sponsor",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 Sponsor",
        description: "Get leaderboard data from the seventh season of THE FINALS - Sponsor.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7SponsorUserSchema,
    },
    embarkApi.season7Sponsor,
  ),
  createLiveLeaderboard(
    {
      id: "s7worldtour",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 World Tour",
        description: "Get leaderboard data from the seventh season of THE FINALS - World Tour.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7WorldTourUserSchema,
    },
    embarkApi.season7WorldTour,
  ),
  createLiveLeaderboard(
    {
      id: "s7terminalattack",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 Terminal Attack",
        description: "Get leaderboard data from the seventh season of THE FINALS - Terminal Attack.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7TerminalAttackUserSchema,
    },
    embarkApi.season7TerminalAttack,
  ),
  createLiveLeaderboard(
    {
      id: "s7powershift",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 PowerShift",
        description: "Get leaderboard data from the seventh season of THE FINALS - PowerShift.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7PowerShiftUserSchema,
    },
    embarkApi.season7PowerShift,
  ),
  createLiveLeaderboard(
    {
      id: "s7quickcash",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 Quick Cash",
        description: "Get leaderboard data from the seventh season of THE FINALS - Quick Cash.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7QuickQashUserSchema,
    },
    embarkApi.season7QuickCash,
  ),
  createLiveLeaderboard(
    {
      id: "s7teamdeathmatch",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 Team Deathmatch",
        description: "Get leaderboard data from the seventh season of THE FINALS - Team Deathmatch.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7TeamDeathmatchUserSchema,
    },
    embarkApi.season7TeamDeathmatch,
  ),
  createLiveLeaderboard(
    {
      id: "s7blastoff",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 7 Blast Off",
        description: "Get leaderboard data from the seventh season of THE FINALS - Blast Off.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season7BlastOffUserSchema,
    },
    embarkApi.season7BlastOff,
  ),

  // Special leaderboards not tied to a season
  createLiveLeaderboard(
    {
      id: "orf",
      availablePlatforms: ["crossplay"],
      metadata: {
        summary: "ÖRF",
        description: "Get leaderboard data from the ÖRF leaderboard.",
        tags: ["Leaderboards - Special"],
      },
      zodSchemaOpenApi: orfUserSchema,
    },
    embarkApi.orf,
  ),

  createOldLeaderboard({
    id: "the-finals",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "THE FINALS",
      description: "Get leaderboard data from the 'The Finals'.",
      tags: ["Leaderboards - Special"],
    },
    zodSchemaOpenApi: theFinalsUserSchema,
  }),
] satisfies BaseAPIRoute[];
