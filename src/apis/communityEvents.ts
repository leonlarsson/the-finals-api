import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
import type { BaseAPIRoute } from "../types";
import fetchCe44Data from "../utils/fetchers/fetchCe44Data";

export const communityEventApiRoutes: BaseAPIRoute[] = [
  {
    id: "ce44",
    availablePlatforms: [],
    metadata: {
      summary: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.",
      tags: ["Community Event"],
    },
    includeInBackup: true,
    fetchData: ({ kv, platform }) => {
      return fetchCe44Data();
    },
    zodSchema: ce44Schema,
    zodSchemaOpenApi: ce44ResponseSchema,
  },
] satisfies BaseAPIRoute[];
