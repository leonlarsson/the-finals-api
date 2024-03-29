import { APIPlatformParam, APIRoute } from "./types";

export const apiRoutes: APIRoute[] = [
  {
    leaderboardVersion: "cb1",
    params: {
      versions: ["cb1", "closedbeta1"],
      platforms: [],
    },
    // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
    url: () =>
      "https://cdn.the-finals-leaderboard.com/data/closedbeta1/data.json",
  },
  {
    leaderboardVersion: "cb2",
    params: {
      versions: ["cb2", "closedbeta2"],
      platforms: [],
    },
    // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
    url: () =>
      "https://cdn.the-finals-leaderboard.com/data/closedbeta2/data.json",
  },
  {
    leaderboardVersion: "ob",
    params: {
      versions: ["ob", "openbeta"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json
    url: (platform: APIPlatformParam) =>
      `https://cdn.the-finals-leaderboard.com/data/openbeta/${platform}.json`,
  },
  {
    leaderboardVersion: "s1",
    params: {
      versions: ["s1", "season1"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json
    url: (platform: APIPlatformParam) =>
      `https://cdn.the-finals-leaderboard.com/data/season1/${platform}.json`,
  },
  {
    leaderboardVersion: "s2",
    params: {
      versions: ["s2", "season2", "live"],
      platforms: ["crossplay", "steam", "xbox", "psn"],
    },
    url: (platform: APIPlatformParam) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
  },
] satisfies APIRoute[];
