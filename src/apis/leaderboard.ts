import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
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
import { theFinalsSchema, theFinalsUserSchema } from "../schemas/leaderboards/theFinals";
import type { LeaderboardAPIRoute } from "../types";
import fetchCe44Data from "../utils/fetchers/fetchCe44Data";
import fetchOrfData from "../utils/fetchers/fetchOrfData";
import fetchS4Data from "../utils/fetchers/fetchS4Data";
import fetchS4SponsorData from "../utils/fetchers/fetchS4SponsorData";
import fetchS4WorldTourData from "../utils/fetchers/fetchS4WorldTourData";
import { getJsonFromKV } from "../utils/kv";

export const leaderboardApiRoutes: LeaderboardAPIRoute[] = [
  {
    type: "leaderboard",
    leaderboardVersion: "cb1",
    leaderboardVersionAliases: ["closedbeta1"],
    availablePlatforms: [],
    metadata: {
      title: "Closed Beta 1",
      description: "Get leaderboard data from the first closed beta of THE FINALS.",
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_closedbeta1");
    },
    zodSchema: closedBeta1Schema,
    zodSchemaOpenApi: closedBeta1UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "cb2",
    leaderboardVersionAliases: ["closedbeta2"],
    availablePlatforms: [],
    metadata: {
      title: "Closed Beta 2",
      description: "Get leaderboard data from the second closed beta of THE FINALS.",
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_closedbeta2");
    },
    zodSchema: closedBeta2Schema,
    zodSchemaOpenApi: closedBeta2UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "ob",
    leaderboardVersionAliases: ["openbeta"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      title: "Open Beta",
      description: "Get leaderboard data from the open beta of THE FINALS.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_openbeta_${platform}`);
    },
    zodSchema: openBetaSchema,
    zodSchemaOpenApi: openBetaUserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s1",
    leaderboardVersionAliases: ["season1"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      title: "Season 1",
      description: "Get leaderboard data from the first season of THE FINALS.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season1_${platform}`);
    },
    zodSchema: season1Schema,
    zodSchemaOpenApi: season1UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s2",
    // "live" was a horrible idea, but it's here now. It will remain on S2
    leaderboardVersionAliases: ["season2", "live"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    metadata: {
      title: "Season 2",
      description: "Get leaderboard data from the second season of THE FINALS.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season2_${platform}`);
    },
    zodSchema: season2Schema,
    zodSchemaOpenApi: season2UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s3",
    leaderboardVersionAliases: ["season3"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 3",
      description: "Get leaderboard data from the third season of THE FINALS.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season3_${platform}`);
    },
    zodSchema: season3Schema,
    zodSchemaOpenApi: season3UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s3original",
    leaderboardVersionAliases: ["season3original"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 3 - Original",
      description: "Get leaderboard data from the third season of THE FINALS. Pre-purge.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season3_${platform}_original`);
    },
    zodSchema: season3Schema,
    zodSchemaOpenApi: season3UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s3worldtour",
    leaderboardVersionAliases: ["season3worldtour"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 3 World Tour",
      description: "Get leaderboard data from the third season of THE FINALS - World Tour.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season3worldtour_${platform}`);
    },
    zodSchema: season3WorldTourSchema,
    zodSchemaOpenApi: season3WorldTourUserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4",
    leaderboardVersionAliases: ["season4"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 4",
      description: "Get leaderboard data from the fourth season of THE FINALS.",
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4Data();
    },
    zodSchema: season4Schema,
    zodSchemaOpenApi: season4UserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4worldtour",
    leaderboardVersionAliases: ["season4worldtour"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 4 World Tour",
      description: "Get leaderboard data from the fourth season of THE FINALS - World Tour.",
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4WorldTourData();
    },
    zodSchema: season4WorldTourSchema,
    zodSchemaOpenApi: season4WorldTourUserSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4sponsor",
    leaderboardVersionAliases: ["season4sponsor"],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Season 4 Sponsor",
      description: "Get leaderboard data from the fourth season of THE FINALS - Sponsor.",
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4SponsorData();
    },
    zodSchema: season4SponsorSchema,
    zodSchemaOpenApi: season4SponsorUserSchema,
  },

  // Special leaderboards. Any non-main leaderboards such as events
  {
    type: "special",
    leaderboardVersion: "the-finals",
    leaderboardVersionAliases: [],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "THE FINALS",
      description: "Get leaderboard data from the 'The Finals'.",
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_the-finals_${platform}`);
    },
    zodSchema: theFinalsSchema,
    zodSchemaOpenApi: theFinalsUserSchema,
  },
  {
    type: "special",
    leaderboardVersion: "orf",
    leaderboardVersionAliases: [],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "ÖRF",
      description: "Get leaderboard data from the ÖRF leaderboard.",
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchOrfData();
    },
    zodSchema: orfSchema,
    zodSchemaOpenApi: orfUserSchema,
  },
] as const satisfies LeaderboardAPIRoute[];
