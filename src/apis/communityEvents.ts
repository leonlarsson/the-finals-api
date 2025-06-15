import { ce44ResponseSchema } from "../schemas/communityEvents/ce44";
import { ce48ResponseSchema } from "../schemas/communityEvents/ce48";
import type { BaseAPIRoute } from "../types";
import { getJsonFromKV } from "../utils/kv";

// 20_160 minutes is 14 days
const oldLeaderboardCacheMinutes = 20_160;

// Community events do not follow the same updated logic as the standard leaderboards
// There hasn't been a community event in a while, so this is not a problem for now
// If more community events are added, I will look into using createOldLeaderboard / createLiveLeaderboard and make sure it works with the 2nd cache layer
export const communityEventApiRoutes: BaseAPIRoute[] = [
  {
    id: "ce44",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.<br/>**Goal: Start 3.5 million cashouts.**",
      tags: ["Community Events"],
    },
    cacheMinutes: oldLeaderboardCacheMinutes,
    backups: {},
    fetchData: async function ({ kv }) {
      return await getJsonFromKV(kv, `data_event_${this.id}`);
    },
    zodSchemaOpenApi: ce44ResponseSchema,
  },
  {
    id: "ce48",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.8",
      description:
        "Get leaderboard data from Community event 4.8.<br/>**Goal: Steal 600,000 cashouts in the final moments.**",
      tags: ["Community Events"],
    },
    cacheMinutes: oldLeaderboardCacheMinutes,
    backups: {},
    fetchData: async function ({ kv }) {
      return await getJsonFromKV(kv, `data_event_${this.id}`);
    },
    zodSchemaOpenApi: ce48ResponseSchema,
  },
] satisfies BaseAPIRoute[];
