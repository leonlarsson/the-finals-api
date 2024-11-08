import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
import type { BaseAPIRoute } from "../types";
import { getJsonFromKV } from "../utils/kv";

export const communityEventApiRoutes: BaseAPIRoute[] = [
  {
    id: "ce44",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.<br/>**Goal: Start 3.5 million cashouts.**",
      tags: ["Community Events"],
    },
    fetchData: async ({ kv }) => {
      return await getJsonFromKV(kv, "data_event_ce44");
    },
    zodSchema: ce44Schema,
    zodSchemaOpenApi: ce44ResponseSchema,
  },
] satisfies BaseAPIRoute[];
