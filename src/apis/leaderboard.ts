import { closedBeta1Schema } from "../transformers/closedBeta1";
import { closedBeta2Schema } from "../transformers/closedBeta2";
import { openBetaSchema } from "../transformers/openBeta";
import { orfSchema } from "../transformers/orf";
import { season1Schema } from "../transformers/season1";
import { season2Schema } from "../transformers/season2";
import { season3Schema } from "../transformers/season3";
import { season3WorldTourSchema } from "../transformers/season3WorldTour";
import { theFinalsSchema } from "../transformers/theFinals";
import { LeaderboardAPIRoute } from "../types";
import fetchOrfData from "../utils/fetchers/fetchOrfData";
import fetchS3WorldTourData from "../utils/fetchers/fetchS3WorldTourData";
import fetchS3data from "../utils/fetchers/fetchS3data";
import fetchTheFinalsData from "../utils/fetchers/fetchTheFinalsData";
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
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
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
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
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
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json
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
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json
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
      // https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json
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
    fetchData: async () => {
      return await fetchS3data();
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
    fetchData: async () => {
      return await fetchS3WorldTourData();
    },
    zodSchema: season3WorldTourSchema,
  },

  // Special leaderboards. Any non-main leaderboards such as events
  {
    type: "special",
    leaderboardVersion: "the-finals",
    params: {
      versions: ["the-finals"],
      platforms: ["crossplay"],
    },
    fetchData: async () => {
      return await fetchTheFinalsData();
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
    fetchData: async () => {
      return await fetchOrfData();
    },
    zodSchema: orfSchema,
  },
] satisfies LeaderboardAPIRoute[];
