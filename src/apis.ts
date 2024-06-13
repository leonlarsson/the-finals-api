import { APIPlatformParam, APIRoute } from "./types";

export const apiRoutes: APIRoute[] = [
  {
    leaderboardVersion: "cb1",
    params: {
      versions: ["cb1", "closedbeta1"],
      platforms: [],
    },
    fetchData: async () => {
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
      // https://cdn.the-finals-leaderboard.com/data/closedbeta1/data.json
      const data = await import("./data/closedbeta1/data.json");
      return data.default;
    },
  },
  {
    leaderboardVersion: "cb2",
    params: {
      versions: ["cb2", "closedbeta2"],
      platforms: [],
    },
    fetchData: async () => {
      // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
      // https://cdn.the-finals-leaderboard.com/data/closedbeta2/data.json
      const data = await import("./data/closedbeta2/data.json");
      return data.default;
    },
  },
  {
    leaderboardVersion: "ob",
    params: {
      versions: ["ob", "openbeta"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: APIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json
      // https://cdn.the-finals-leaderboard.com/data/openbeta/${platform}.json
      const imports = {
        crossplay: () => import("./data/openbeta/crossplay.json"),
        steam: () => import("./data/openbeta/steam.json"),
        xbox: () => import("./data/openbeta/xbox.json"),
        psn: () => import("./data/openbeta/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
  },
  {
    leaderboardVersion: "s1",
    params: {
      versions: ["s1", "season1"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: APIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json
      // https://cdn.the-finals-leaderboard.com/data/season1/${platform}.json
      const imports = {
        crossplay: () => import("./data/season1/crossplay.json"),
        steam: () => import("./data/season1/steam.json"),
        xbox: () => import("./data/season1/xbox.json"),
        psn: () => import("./data/season1/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
  },
  {
    leaderboardVersion: "s2",
    params: {
      versions: ["s2", "season2", "live"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    fetchData: async (platform: APIPlatformParam) => {
      // https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json
      const imports = {
        crossplay: () => import("./data/season2/crossplay.json"),
        steam: () => import("./data/season2/steam.json"),
        xbox: () => import("./data/season2/xbox.json"),
        psn: () => import("./data/season2/psn.json"),
      };

      const data = await imports[platform]();
      return data.default;
    },
  },
  // {
  //   leaderboardVersion: "s3",
  //   params: {
  //     versions: ["s3", "season3", "live"],
  //     platforms: ["crossplay", "steam", "xbox", "psn"],
  //   },
  //   fetchData: async (platform: APIPlatformParam) => {
  //     const data = await fetchS3data();
  //     return data;
  //   },
  // },
] satisfies APIRoute[];
