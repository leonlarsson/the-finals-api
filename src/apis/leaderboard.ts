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
import { season5QuickCashUserSchema } from "../schemas/leaderboards/season5QuickCash";
import { season5SponsorUserSchema } from "../schemas/leaderboards/season5Sponsor";
import { season5TerminalAttackUserSchema } from "../schemas/leaderboards/season5TerminalAttack";
import { season5WorldTourUserSchema } from "../schemas/leaderboards/season5WorldTour";
import { season6UserSchema } from "../schemas/leaderboards/season6";
import { season6HeavyHittersUserSchema } from "../schemas/leaderboards/season6HeavyHitters";
import { season6PowerShiftUserSchema } from "../schemas/leaderboards/season6PowerShift";
import { season6QuickCashUserSchema } from "../schemas/leaderboards/season6QuickCash";
import { season6SponsorUserSchema } from "../schemas/leaderboards/season6Sponsor";
import { season6TeamDeathmatchUserSchema } from "../schemas/leaderboards/season6TeamDeathmatch";
import { season6TerminalAttackUserSchema } from "../schemas/leaderboards/season6TerminalAttack";
import { season6WorldTourUserSchema } from "../schemas/leaderboards/season6WorldTour";
import { season7UserSchema } from "../schemas/leaderboards/season7";
import { season7BlastOffUserSchema } from "../schemas/leaderboards/season7BlastOff";
import { season7CashBallUserSchema } from "../schemas/leaderboards/season7CashBall";
import { season7PowerShiftUserSchema } from "../schemas/leaderboards/season7PowerShift";
import { season7QuickCashUserSchema } from "../schemas/leaderboards/season7QuickCash";
import { season7SponsorUserSchema } from "../schemas/leaderboards/season7Sponsor";
import { season7TeamDeathmatchUserSchema } from "../schemas/leaderboards/season7TeamDeathmatch";
import { season7TerminalAttackUserSchema } from "../schemas/leaderboards/season7TerminalAttack";
import { season7WorldTourUserSchema } from "../schemas/leaderboards/season7WorldTour";
import { season8UserSchema } from "../schemas/leaderboards/season8";
import { season8BlastOffUserSchema } from "../schemas/leaderboards/season8BlastOff";
import { season8GhoulRushUserSchema } from "../schemas/leaderboards/season8GhoulRush";
import { season8Head2HeadUserSchema } from "../schemas/leaderboards/season8Head2Head";
import { season8HeavenOrElseUserSchema } from "../schemas/leaderboards/season8HeavenOrElse";
import { season8PowerShiftUserSchema } from "../schemas/leaderboards/season8PowerShift";
import { season8QuickCashUserSchema } from "../schemas/leaderboards/season8QuickCash";
import { season8SponsorUserSchema } from "../schemas/leaderboards/season8Sponsor";
import { season8TeamDeathmatchUserSchema } from "../schemas/leaderboards/season8TeamDeathmatch";
import { season8WorldTourUserSchema } from "../schemas/leaderboards/season8WorldTour";
import { season9UserSchema } from "../schemas/leaderboards/season9";
import { season9BankItUserSchema } from "../schemas/leaderboards/season9BankIt";
import { season9Head2HeadUserSchema } from "../schemas/leaderboards/season9Head2Head";
import { season9PointBreakUserSchema } from "../schemas/leaderboards/season9PointBreak";
import { season9PowerShiftUserSchema } from "../schemas/leaderboards/season9PowerShift";
import { season9QuickCashUserSchema } from "../schemas/leaderboards/season9QuickCash";
import { season9SponsorUserSchema } from "../schemas/leaderboards/season9Sponsor";
import { season9TeamDeathmatchUserSchema } from "../schemas/leaderboards/season9TeamDeathmatch";
import { season9WorldTourUserSchema } from "../schemas/leaderboards/season9WorldTour";
import { season10UserSchema } from "../schemas/leaderboards/season10";
import { season10CreatorGauntletUserSchema } from "../schemas/leaderboards/season10CreatorGauntlet";
import { season10PointBreakUserSchema } from "../schemas/leaderboards/season10PointBreak";
import { season10PowerShiftUserSchema } from "../schemas/leaderboards/season10PowerShift";
import { season10QuickCashUserSchema } from "../schemas/leaderboards/season10QuickCash";
import { season10SponsorUserSchema } from "../schemas/leaderboards/season10Sponsor";
import { season10StarlightHollowUserSchema } from "../schemas/leaderboards/season10StarlightHollow";
import { season10TeamDeathmatchUserSchema } from "../schemas/leaderboards/season10TeamDeathmatch";
import { season10The24HourGauntletUserSchema } from "../schemas/leaderboards/season10The24HourGauntlet";
import { season10WorldTourUserSchema } from "../schemas/leaderboards/season10WorldTour";
import { season11UserSchema } from "../schemas/leaderboards/season11";
import { season11PointBreakUserSchema } from "../schemas/leaderboards/season11PointBreak";
import { season11PowerShiftUserSchema } from "../schemas/leaderboards/season11PowerShift";
import { season11QuickCashUserSchema } from "../schemas/leaderboards/season11QuickCash";
import { season11SponsorUserSchema } from "../schemas/leaderboards/season11Sponsor";
import { season11TeamDeathmatchUserSchema } from "../schemas/leaderboards/season11TeamDeathmatch";
import { season11WorldTourUserSchema } from "../schemas/leaderboards/season11WorldTour";
import { theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { BaseAPIRoute, LeaderboardPlatforms } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import { getJsonFromKV } from "../utils/kv";
import { cachedFetchStandardEmbarkLeaderboardData, type EmbarkApi, embarkApi } from "./embarkApi";

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
      // +0–100% jitter meaning TTL can be between 10 and 20 minutes. * 1 is useless, but whatever. Might change.
      const jitter = 1 + Math.random() * 1;

      return fetchWithKVFallback(
        () => cachedFetchStandardEmbarkLeaderboardData(embarkApi, kv, Math.round(this.cacheMinutes * 60 * jitter), ctx),
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
    zodSchemaOpenApi: season5QuickCashUserSchema,
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
    zodSchemaOpenApi: season6QuickCashUserSchema,
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
  createOldLeaderboard({
    id: "s7",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7",
      description: "Get leaderboard data from the seventh season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7UserSchema,
  }),
  createOldLeaderboard({
    id: "s7sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Sponsor",
      description: "Get leaderboard data from the seventh season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s7worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 World Tour",
      description: "Get leaderboard data from the seventh season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s7terminalattack",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Terminal Attack",
      description: "Get leaderboard data from the seventh season of THE FINALS - Terminal Attack.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7TerminalAttackUserSchema,
  }),
  createOldLeaderboard({
    id: "s7powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 PowerShift",
      description: "Get leaderboard data from the seventh season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s7quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Quick Cash",
      description: "Get leaderboard data from the seventh season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7QuickCashUserSchema,
  }),
  createOldLeaderboard({
    id: "s7teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Team Deathmatch",
      description: "Get leaderboard data from the seventh season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7TeamDeathmatchUserSchema,
  }),
  createOldLeaderboard({
    id: "s7blastoff",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Blast Off",
      description: "Get leaderboard data from the seventh season of THE FINALS - Blast Off.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7BlastOffUserSchema,
  }),
  createOldLeaderboard({
    id: "s7cashball",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 7 Cash Ball",
      description: "Get leaderboard data from the seventh season of THE FINALS - Cash Ball.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season7CashBallUserSchema,
  }),

  // SEASON 8
  createOldLeaderboard({
    id: "s8",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8",
      description: "Get leaderboard data from the eighth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8UserSchema,
  }),
  createOldLeaderboard({
    id: "s8sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Sponsor",
      description: "Get leaderboard data from the eighth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s8worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 World Tour",
      description: "Get leaderboard data from the eighth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s8head2head",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Head2Head",
      description: "Get leaderboard data from the eighth season of THE FINALS - Head2Head.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8Head2HeadUserSchema,
  }),
  createOldLeaderboard({
    id: "s8powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 PowerShift",
      description: "Get leaderboard data from the eighth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s8quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Quick Cash",
      description: "Get leaderboard data from the eighth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8QuickCashUserSchema,
  }),
  createOldLeaderboard({
    id: "s8teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Team Deathmatch",
      description: "Get leaderboard data from the eighth season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8TeamDeathmatchUserSchema,
  }),
  createOldLeaderboard({
    id: "s8blastoff",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Blast Off",
      description: "Get leaderboard data from the eighth season of THE FINALS - Blast Off.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8BlastOffUserSchema,
  }),
  createOldLeaderboard({
    id: "s8ghoulrush",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Ghoul Rush",
      description: "Get leaderboard data from the eighth season of THE FINALS - Ghoul Rush.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8GhoulRushUserSchema,
  }),
  createOldLeaderboard({
    id: "s8heavenorelse",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 8 Heaven Or Else",
      description: "Get leaderboard data from the eighth season of THE FINALS - Heaven Or Else.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season8HeavenOrElseUserSchema,
  }),

  // SEASON 9
  createOldLeaderboard({
    id: "s9",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9",
      description: "Get leaderboard data from the ninth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9UserSchema,
  }),
  createOldLeaderboard({
    id: "s9sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Sponsor",
      description: "Get leaderboard data from the ninth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s9worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 World Tour",
      description: "Get leaderboard data from the ninth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s9head2head",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Head2Head",
      description: "Get leaderboard data from the ninth season of THE FINALS - Head2Head.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9Head2HeadUserSchema,
  }),
  createOldLeaderboard({
    id: "s9powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 PowerShift",
      description: "Get leaderboard data from the ninth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s9quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Quick Cash",
      description: "Get leaderboard data from the ninth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9QuickCashUserSchema,
  }),
  createOldLeaderboard({
    id: "s9teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Team Deathmatch",
      description: "Get leaderboard data from the ninth season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9TeamDeathmatchUserSchema,
  }),
  createOldLeaderboard({
    id: "s9pointbreak",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Point Break",
      description: "Get leaderboard data from the ninth season of THE FINALS - Point Break.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9PointBreakUserSchema,
  }),
  createOldLeaderboard({
    id: "s9bankit",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 9 Bank It",
      description: "Get leaderboard data from the ninth season of THE FINALS - Bank It.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season9BankItUserSchema,
  }),

  // SEASON 10
  createOldLeaderboard({
    id: "s10",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10",
      description: "Get leaderboard data from the tenth season of THE FINALS.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10UserSchema,
  }),
  createOldLeaderboard({
    id: "s10sponsor",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Sponsor",
      description: "Get leaderboard data from the tenth season of THE FINALS - Sponsor.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10SponsorUserSchema,
  }),
  createOldLeaderboard({
    id: "s10worldtour",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 World Tour",
      description: "Get leaderboard data from the tenth season of THE FINALS - World Tour.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10WorldTourUserSchema,
  }),
  createOldLeaderboard({
    id: "s10powershift",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 PowerShift",
      description: "Get leaderboard data from the tenth season of THE FINALS - PowerShift.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10PowerShiftUserSchema,
  }),
  createOldLeaderboard({
    id: "s10quickcash",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Quick Cash",
      description: "Get leaderboard data from the tenth season of THE FINALS - Quick Cash.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10QuickCashUserSchema,
  }),
  createOldLeaderboard({
    id: "s10teamdeathmatch",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Team Deathmatch",
      description: "Get leaderboard data from the tenth season of THE FINALS - Team Deathmatch.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10TeamDeathmatchUserSchema,
  }),
  createOldLeaderboard({
    id: "s10pointbreak",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Point Break",
      description: "Get leaderboard data from the tenth season of THE FINALS - Point Break.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10PointBreakUserSchema,
  }),
  createOldLeaderboard({
    id: "s10starlighthollow",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Starlight Hollow",
      description: "Get leaderboard data from the tenth season of THE FINALS - Starlight Hollow.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10StarlightHollowUserSchema,
  }),
  createOldLeaderboard({
    id: "s10the24hourgauntlet",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 The 24 Hour Gauntlet",
      description: "Get leaderboard data from the tenth season of THE FINALS - The 24 Hour Gauntlet.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10The24HourGauntletUserSchema,
  }),
  createOldLeaderboard({
    id: "s10creatorgauntlet",
    availablePlatforms: ["crossplay"],
    hasClubData: true,
    metadata: {
      summary: "Season 10 Creator Gauntlet",
      description: "Get leaderboard data from the tenth season of THE FINALS - Creator Gauntlet.",
      tags: ["Leaderboards"],
    },
    zodSchemaOpenApi: season10CreatorGauntletUserSchema,
  }),

  // SEASON 11
  createLiveLeaderboard(
    {
      id: "s11",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11",
        description: "Get leaderboard data from the eleventh season of THE FINALS.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11UserSchema,
    },
    embarkApi.season11,
  ),
  createLiveLeaderboard(
    {
      id: "s11sponsor",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 Sponsor",
        description: "Get leaderboard data from the eleventh season of THE FINALS - Sponsor.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11SponsorUserSchema,
    },
    embarkApi.season11Sponsor,
  ),
  createLiveLeaderboard(
    {
      id: "s11worldtour",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 World Tour",
        description: "Get leaderboard data from the eleventh season of THE FINALS - World Tour.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11WorldTourUserSchema,
    },
    embarkApi.season11WorldTour,
  ),
  createLiveLeaderboard(
    {
      id: "s11powershift",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 PowerShift",
        description: "Get leaderboard data from the eleventh season of THE FINALS - PowerShift.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11PowerShiftUserSchema,
    },
    embarkApi.season11PowerShift,
  ),
  createLiveLeaderboard(
    {
      id: "s11quickcash",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 Quick Cash",
        description: "Get leaderboard data from the eleventh season of THE FINALS - Quick Cash.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11QuickCashUserSchema,
    },
    embarkApi.season11QuickCash,
  ),
  createLiveLeaderboard(
    {
      id: "s11teamdeathmatch",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 Team Deathmatch",
        description: "Get leaderboard data from the eleventh season of THE FINALS - Team Deathmatch.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11TeamDeathmatchUserSchema,
    },
    embarkApi.season11TeamDeathmatch,
  ),
  createLiveLeaderboard(
    {
      id: "s11pointbreak",
      availablePlatforms: ["crossplay"],
      hasClubData: true,
      metadata: {
        summary: "Season 11 Point Break",
        description: "Get leaderboard data from the eleventh season of THE FINALS - Point Break.",
        tags: ["Leaderboards"],
      },
      zodSchemaOpenApi: season11PointBreakUserSchema,
    },
    embarkApi.season11PointBreak,
  ),

  // Special leaderboards not tied to a season
  createOldLeaderboard({
    id: "orf",
    availablePlatforms: ["crossplay"],
    metadata: {
      summary: "ÖRF",
      description: "Get leaderboard data from the ÖRF leaderboard. Stopped being available from Season 8.",
      tags: ["Leaderboards - Special"],
    },
    zodSchemaOpenApi: orfUserSchema,
  }),

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
