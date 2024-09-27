import { closedBeta1Schema } from "../transformers/closedBeta1";
import { closedBeta2Schema } from "../transformers/closedBeta2";
import { openBetaSchema } from "../transformers/openBeta";
import { orfSchema } from "../transformers/orf";
import { season1Schema } from "../transformers/season1";
import { season2Schema } from "../transformers/season2";
import { season3Schema } from "../transformers/season3";
import { season3WorldTourSchema } from "../transformers/season3WorldTour";
import { season4Schema } from "../transformers/season4";
import { season4SponsorSchema } from "../transformers/season4Sponsor";
import { season4WorldTourSchema } from "../transformers/season4WorldTour";
import { theFinalsSchema } from "../transformers/theFinals";
import type { LeaderboardAPIRoute } from "../types";
import fetchOrfData from "../utils/fetchers/fetchOrfData";
import fetchS4Data from "../utils/fetchers/fetchS4Data";
import fetchS4SponsorData from "../utils/fetchers/fetchS4SponsorData";
import fetchS4WorldTourData from "../utils/fetchers/fetchS4WorldTourData";
import { getJsonFromKV } from "../utils/kv";

export const apiRoutes: LeaderboardAPIRoute[] = [
  {
    type: "leaderboard",
    leaderboardVersion: "cb1",
    params: {
      versions: ["cb1", "closedbeta1"],
      platforms: [],
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_closedbeta1");
    },
    zodSchema: closedBeta1Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "cb2",
    params: {
      versions: ["cb2", "closedbeta2"],
      platforms: [],
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_closedbeta2");
    },
    zodSchema: closedBeta2Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "ob",
    params: {
      versions: ["ob", "openbeta"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_openbeta_${platform}`);
    },
    zodSchema: openBetaSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s1",
    params: {
      versions: ["s1", "season1"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season1_${platform}`);
    },
    zodSchema: season1Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s2",
    params: {
      // "live" was a horrible idea, but it's here now. It will remain on S2
      versions: ["s2", "season2", "live"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season2_${platform}`);
    },
    zodSchema: season2Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s3",
    params: {
      versions: ["s3", "season3"],
      platforms: ["crossplay"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season3_${platform}`);
    },
    zodSchema: season3Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s3worldtour",
    params: {
      versions: ["s3worldtour", "season3worldtour"],
      platforms: ["crossplay"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_season3worldtour_${platform}`);
    },
    zodSchema: season3WorldTourSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4",
    params: {
      versions: ["s4", "season4"],
      platforms: ["crossplay"],
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4Data();
    },
    zodSchema: season4Schema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4worldtour",
    params: {
      versions: ["s4worldtour", "season4worldtour"],
      platforms: ["crossplay"],
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4WorldTourData();
    },
    zodSchema: season4WorldTourSchema,
  },
  {
    type: "leaderboard",
    leaderboardVersion: "s4sponsor",
    params: {
      versions: ["s4sponsor", "season4sponsor"],
      platforms: ["crossplay"],
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchS4SponsorData();
    },
    zodSchema: season4SponsorSchema,
  },

  // Special leaderboards. Any non-main leaderboards such as events
  {
    type: "special",
    leaderboardVersion: "the-finals",
    params: {
      versions: ["the-finals"],
      platforms: ["crossplay"],
    },
    fetchData: async ({ kv, platform }) => {
      return await getJsonFromKV(kv, `data_the-finals_${platform}`);
    },
    zodSchema: theFinalsSchema,
  },
  {
    type: "special",
    leaderboardVersion: "orf",
    params: {
      versions: ["orf"],
      platforms: ["crossplay"],
    },
    includeInBackup: true,
    fetchData: async () => {
      return await fetchOrfData();
    },
    zodSchema: orfSchema,
  },
] satisfies LeaderboardAPIRoute[];
