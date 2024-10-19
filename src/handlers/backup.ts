import { apiRoutes } from "../apis/leaderboard";
import type { LeaderboardAPIRoute, LeaderboardPlatforms } from "../types";

export default async (kv: KVNamespace) => {
  const backupData = async (route: LeaderboardAPIRoute, platform: LeaderboardPlatforms) => {
    // Fetch data
    const data = await route.fetchData({ kv, platform });

    // Validate data
    const { success } = route.zodSchema.safeParse(data);

    // If data is valid, backup to KV
    if (success) {
      // Append _platform if route has platforms
      const key =
        route.params.platforms.length === 0
          ? `backup_${route.leaderboardVersion}`
          : `backup_${route.leaderboardVersion}_${platform}`;

      await kv.put(key, JSON.stringify(data));
    }
  };

  // For each route
  for (const route of apiRoutes.filter((r) => r.includeInBackup)) {
    const platforms = route.params.platforms;

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
