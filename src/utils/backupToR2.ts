import { communityEventApiRoutes } from "../apis/communityEvents";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import type { BaseAPIRoute, LeaderboardPlatforms } from "../types";

export const backupToR2 = async (kv: KVNamespace, r2: R2Bucket) => {
  const backupData = async (route: BaseAPIRoute, platform: LeaderboardPlatforms) => {
    // Fetch data
    const data = await route.fetchData({ kv, platform });

    // At this point, the data has been fetched, validated, and transformed
    const normalizedSummary = route.metadata.summary.replaceAll(/[^a-zA-Z0-9Ö]/g, "_").toLowerCase();

    // Append _{platform} if route has platforms
    const filename =
      route.availablePlatforms.length === 0 ? `data_${normalizedSummary}` : `data_${normalizedSummary}_${platform}`;

    const content = `Below is THE FINALS (video game) leaderboard data for ${route.metadata.summary}. The platform is ${platform}. It features up to the top 10,000 players for this season/gamemode/platform.\n\n${JSON.stringify(data, null, 2)}`;

    await r2.put(`leaderboards/${filename}.txt`, content);
  };

  // For each route
  for (const route of [...leaderboardApiRoutes, ...communityEventApiRoutes].filter((r) => r.backups?.r2)) {
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

  await kv.put("last-r2-backup", new Date().toISOString());
  return new Response("R2 backup complete");
};
