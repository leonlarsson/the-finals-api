import { leaderboardApiRoutes } from "../apis/leaderboard";
import type { CommunityEventAPIRoute, LeaderboardAPIRoute, LeaderboardPlatforms } from "../types";

export default async (kv: KVNamespace) => {
  const backupData = async (route: LeaderboardAPIRoute | CommunityEventAPIRoute, platform: LeaderboardPlatforms) => {
    // Fetch data
    const data = await route.fetchData({ kv, platform });

    // Validate data
    const { success } = route.zodSchema.safeParse(data);

    // If data is valid, backup to KV
    if (success) {
      const eventBit = route.type === "event" ? "event_" : "";

      // Append _platform if route has platforms
      const key =
        route.availablePlatforms.length === 0
          ? `backup_${eventBit}${route.leaderboardVersion}`
          : `backup_${eventBit}${route.leaderboardVersion}_${platform}`;

      await kv.put(key, JSON.stringify(data));
    }
  };

  // For each route
  for (const route of leaderboardApiRoutes.filter((r) => r.includeInBackup)) {
    const platforms = route.availablePlatforms;

    // If route has no platforms, platform param doesn't really matter
    // If it does, backup data for each platform
    if (platforms.length === 0) {
      await backupData(route, "crossplay");
    } else {
      for (const platform of platforms) {
        await backupData(route, platform);
      }
    }
  }

  await kv.put("last-backup", new Date().toISOString());
  return new Response("Backup complete");
};
