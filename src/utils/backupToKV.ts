import { communityEventApiRoutes } from "../apis/communityEvents";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import type { BaseAPIRoute, LeaderboardPlatforms } from "../types";

export const backupToKV = async (kv: KVNamespace) => {
  const backupData = async (route: BaseAPIRoute, platform: LeaderboardPlatforms) => {
    // Fetch data
    const data = await route.fetchData({ kv, platform });

    // At this point, the data has been fetched, validated, and transformed
    const eventBit = route.metadata.tags.includes("Community Events") ? "event_" : "";

    // Append _platform if route has platforms
    const key =
      route.availablePlatforms.length === 0
        ? `backup_${eventBit}${route.id}`
        : `backup_${eventBit}${route.id}_${platform}`;

    await kv.put(key, JSON.stringify(data));
  };

  // For each route
  for (const route of [...leaderboardApiRoutes, ...communityEventApiRoutes].filter((r) => r.backups?.kv)) {
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
