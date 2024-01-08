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
    version: ["live"],
    availablePlatforms: ["crossplay", "steam", "xbox", "psn"],
    url: (platform: APIPlatform) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json`,
  },
] satisfies APIRoute[];
