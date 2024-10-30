import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
import type { BaseAPIRoute } from "../types";
import { fetchWithKVFallback } from "../utils/fetchWithKVFallback";
import fetchCe44Data from "../utils/fetchers/fetchCe44Data";

export const communityEventApiRoutes: BaseAPIRoute[] = [
  {
    id: "ce44",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.<br/>**Goal: Start 3.5 million cashouts.**",
      tags: ["Community Events"],
    },
    includeInBackup: true,
    fetchData: ({ kv }) => {
      return fetchWithKVFallback(fetchCe44Data, kv, "backup_event_ce44");
    },
    zodSchema: ce44Schema,
    zodSchemaOpenApi: ce44ResponseSchema,
  },
] satisfies BaseAPIRoute[];
