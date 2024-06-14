import { closedBeta1Schema } from "../transformers/closedBeta1";
import { closedBeta2Schema } from "../transformers/closedBeta2";
import { openBetaSchema } from "../transformers/openBeta";
import { season1Schema } from "../transformers/season1";
import { season2Schema } from "../transformers/season2";
import { season3Schema } from "../transformers/season3";
import { season3WorldTourSchema } from "../transformers/season3WorldTour";
import { LeaderboardAPIPlatformParam, LeaderboardAPIRoute } from "../types";
import fetchS3WorldTourData from "../utils/fetchers/fetchS3WorldTourData";
import fetchS3data from "../utils/fetchers/fetchS3data";

export const apiRoutes: LeaderboardAPIRoute[] = [
  {
    leaderboardVersion: "cb1",
    params: {
      versions: ["cb1", "closedbeta1"],
      platforms: [],
    },
    fetchData: async () => {
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
      const data = await import("../data/closedbeta1/data.json");
      return data.default;
    },
    zodSchema: closedBeta1Schema,
  },
  {
    leaderboardVersion: "cb2",
    params: {
      versions: ["cb2", "closedbeta2"],
      platforms: [],
    },
    fetchData: async () => {
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
      const data = await import("../data/closedbeta2/data.json");
      return data.default;
    },
    zodSchema: closedBeta2Schema,
  },
  {
    leaderboardVersion: "ob",
    params: {
      versions: ["ob", "openbeta"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: LeaderboardAPIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json
      const imports = {
        crossplay: () => import("../data/openbeta/crossplay.json"),
        steam: () => import("../data/openbeta/steam.json"),
        xbox: () => import("../data/openbeta/xbox.json"),
        psn: () => import("../data/openbeta/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
    zodSchema: openBetaSchema,
  },
  {
    leaderboardVersion: "s1",
    params: {
      versions: ["s1", "season1"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: LeaderboardAPIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json
      const imports = {
        crossplay: () => import("../data/season1/crossplay.json"),
        steam: () => import("../data/season1/steam.json"),
        xbox: () => import("../data/season1/xbox.json"),
        psn: () => import("../data/season1/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
    zodSchema: season1Schema,
  },
  {
    leaderboardVersion: "s2",
    params: {
      // "live" was a horrible idea, but it's here now. It will remain on S2
      versions: ["s2", "season2", "live"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: LeaderboardAPIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json
      const imports = {
        crossplay: () => import("../data/season2/crossplay.json"),
        steam: () => import("../data/season2/steam.json"),
        xbox: () => import("../data/season2/xbox.json"),
        psn: () => import("../data/season2/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
    zodSchema: season2Schema,
  },
  {
    leaderboardVersion: "s3",
    params: {
      versions: ["s3", "season3"],
      platforms: ["crossplay"],
    },
    fetchData: async () => {
      const data = await fetchS3data();
      return data;
    },
    zodSchema: season3Schema,
  },
  {
    leaderboardVersion: "s3worldtour",
    params: {
      versions: ["s3worldtour", "season3worldtour"],
      platforms: ["crossplay"],
    },
    fetchData: async () => {
      const data = await fetchS3WorldTourData();
      return data;
    },
    zodSchema: season3WorldTourSchema,
  },
] satisfies LeaderboardAPIRoute[];
