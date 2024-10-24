import { ce44ResponseSchema, ce44Schema } from "../schemas/communityEvents/ce44";
import type { CommunityEventAPIRoute } from "../types";
import fetchCe44Data from "../utils/fetchers/fetchCe44Data";

export const communityEventApiRoutes = [
  {
    type: "event",
    leaderboardVersion: "ce44",
    leaderboardVersionAliases: [],
    availablePlatforms: ["crossplay"],
    metadata: {
      title: "Community Event 4.4",
      description: "Get leaderboard data from Community event 4.4.",
    },
    includeInBackup: true,
    fetchData: ({ kv, platform }) => {
      return fetchCe44Data();
    },
    zodSchema: ce44Schema,
    zodSchemaOpenApi: ce44ResponseSchema,
  },
] as const satisfies CommunityEventAPIRoute[];
