import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { communityEventApiRoutes } from "../apis/communityEvents";
import { leaderboardApiRoutes } from "../apis/leaderboard";
import type { BaseAPIRoute, Env, LeaderboardPlatforms } from "../types";

type Params = {
  something: string;
};

export class BackupWorkflow extends WorkflowEntrypoint<Env["Bindings"], Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do(
      "Fetch and validate leaderboards",
      {
        retries: {
          limit: 3,
          delay: 1000,
          backoff: "exponential",
        },
      },
      async () => {
        const dataToBackup: { leaderboardId: string; platform: LeaderboardPlatforms; data: unknown }[] = [];

        const fetchAndValidateData = async (leaderboard: BaseAPIRoute, platform: LeaderboardPlatforms) => {
          const data = await leaderboard.fetchData({ kv: this.env.KV, platform });
          dataToBackup.push({ leaderboardId: leaderboard.id, platform, data });
        };

        const leaderboardsToBackup = [...leaderboardApiRoutes, ...communityEventApiRoutes].filter(
          (r) => r.includeInBackup,
        );
        for (const leaderboard of leaderboardsToBackup) {
          const platforms = leaderboard.availablePlatforms;

          if (platforms.length === 0) {
            await fetchAndValidateData(leaderboard, "crossplay");
          } else {
            for (const platform of platforms) {
              await fetchAndValidateData(leaderboard, platform);
            }
          }
        }

        for (const { leaderboardId, platform, data } of dataToBackup) {
          const leaderboard = leaderboardsToBackup.find((l) => l.id === leaderboardId) as BaseAPIRoute;
          const key = getKey(leaderboard, platform);
          await this.env.KV.put(key, JSON.stringify(data));
        }
      },
    );

    await step.do("Save last backup date", async () => {
      await this.env.KV.put("last-backup", event.timestamp.toISOString());
    });
  }
}

const getKey = (leaderboard: BaseAPIRoute, platform: LeaderboardPlatforms): string => {
  const eventBit = leaderboard.metadata.tags.includes("Community Events") ? "event_" : "";

  // Append _platform if route has platforms
  return leaderboard.availablePlatforms.length === 0
    ? `backup_${eventBit}${leaderboard.id}`
    : `backup_${eventBit}${leaderboard.id}_${platform}`;
};
