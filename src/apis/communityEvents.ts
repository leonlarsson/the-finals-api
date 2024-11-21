import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
import { ce48ResponseSchema, ce48Schema } from "../schemas/communityEvents/ce48";
import type { BaseAPIRoute } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import fetchCe48Data from "../utils/fetchers/fetchCe48Data";
import { getJsonFromKV } from "../utils/kv";

// 20_160 minutes is 14 days
const oldLeaderboardCacheMinutes = 20_160;

export const communityEventApiRoutes: BaseAPIRoute[] = [
  {
    id: "ce44",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.<br/>**Goal: Start 3.5 million cashouts.**",
      tags: ["Community Events"],
      cacheMinutes: oldLeaderboardCacheMinutes,
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_event_ce44");
    },
    zodSchema: ce44Schema,
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
    includeInBackup: true,
    fetchData: async ({ kv }) => {
      return await fetchWithKVFallback(fetchCe48Data, kv, "backup_event_ce48");
    },
    zodSchema: ce48Schema,
    zodSchemaOpenApi: ce48ResponseSchema,
  },
] satisfies BaseAPIRoute[];
