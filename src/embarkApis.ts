import { APIPlatform, APIRoute } from "./types";

export const apiRoutes: APIRoute[] = [
  {
    version: ["cb1", "closedbeta1"],
    availablePlatforms: [],
    url: () =>
      "https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json",
  },
  {
    version: ["cb2", "closedbeta2"],
    availablePlatforms: [],
    url: () =>
      "https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json",
  },
  {
    version: ["ob", "openbeta"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    url: (platform: APIPlatform) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}.json`,
  },
  {
    version: ["s1", "season1"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    url: (platform: APIPlatform) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json`,
  },
  {
    version: ["s2", "season2", "live"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    url: (platform: APIPlatform) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
  },
] satisfies APIRoute[];
