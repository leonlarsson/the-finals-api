import { APIPlatform, APIRoute } from "./types";

export const apiRoutes: APIRoute[] = [
  {
    version: ["cb1", "closedbeta1"],
    availablePlatforms: [],
    // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
    url: () =>
      "https://cdn.the-finals-leaderboard.com/data/closedbeta1/data.json",
  },
  {
    version: ["cb2", "closedbeta2"],
    availablePlatforms: [],
    // https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
    url: () =>
      "https://cdn.the-finals-leaderboard.com/data/closedbeta2/data.json",
  },
  {
    version: ["ob", "openbeta"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json
    url: (platform: APIPlatform) =>
      `https://cdn.the-finals-leaderboard.com/data/openbeta/${platform}.json`,
  },
  {
    version: ["s1", "season1"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    // https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json
    url: (platform: APIPlatform) =>
      `https://cdn.the-finals-leaderboard.com/data/season1/${platform}.json`,
  },
  {
    version: ["s2", "season2", "live"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    url: (platform: APIPlatform) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
  },
] satisfies APIRoute[];
