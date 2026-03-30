import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season9Schema } from "../schemas/leaderboards/season9";
import { season9BankItSchema } from "../schemas/leaderboards/season9BankIt";
import { season9Head2HeadSchema } from "../schemas/leaderboards/season9Head2Head";
import { season9PointBreakSchema } from "../schemas/leaderboards/season9PointBreak";
import { season9PowerShiftSchema } from "../schemas/leaderboards/season9PowerShift";
import { season9QuickCashSchema } from "../schemas/leaderboards/season9QuickCash";
import { season9SponsorSchema } from "../schemas/leaderboards/season9Sponsor";
import { season9TeamDeathmatchSchema } from "../schemas/leaderboards/season9TeamDeathmatch";
import { season9WorldTourSchema } from "../schemas/leaderboards/season9WorldTour";
import { season10Schema } from "../schemas/leaderboards/season10";
import { season10CreatorGauntletSchema } from "../schemas/leaderboards/season10CreatorGauntlet";
import { season10PointBreakSchema } from "../schemas/leaderboards/season10PointBreak";
import { season10PowerShiftSchema } from "../schemas/leaderboards/season10PowerShift";
import { season10QuickCashSchema } from "../schemas/leaderboards/season10QuickCash";
import { season10SponsorSchema } from "../schemas/leaderboards/season10Sponsor";
import { season10StarlightHollowSchema } from "../schemas/leaderboards/season10StarlightHollow";
import { season10TeamDeathmatchSchema } from "../schemas/leaderboards/season10TeamDeathmatch";
import { season10The24HourGauntletSchema } from "../schemas/leaderboards/season10The24HourGauntlet";
import { season10WorldTourSchema } from "../schemas/leaderboards/season10WorldTour";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season10: {
    url: "https://id.embark.games/the-finals/leaderboards/s10",
    zodSchema: season10Schema,
  },
  season10Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s10s",
    zodSchema: season10SponsorSchema,
  },
  season10WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s10wt",
    zodSchema: season10WorldTourSchema,
  },
  season10PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s10ps",
    zodSchema: season10PowerShiftSchema,
  },
  season10QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s10qc",
    zodSchema: season10QuickCashSchema,
  },
  season10TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s10tdm",
    zodSchema: season10TeamDeathmatchSchema,
  },
  season10PointBreak: {
    url: "https://id.embark.games/the-finals/leaderboards/s10pb",
    zodSchema: season10PointBreakSchema,
  },
  season10StarlightHollow: {
    url: "https://id.embark.games/the-finals/leaderboards/s10pbe",
    zodSchema: season10StarlightHollowSchema,
  },
  season10The24HourGauntlet: {
    url: "https://id.embark.games/the-finals/leaderboards/s10l1",
    zodSchema: season10The24HourGauntletSchema,
  },
  season10CreatorGauntlet: {
    url: "https://id.embark.games/the-finals/leaderboards/s10l2",
    zodSchema: season10CreatorGauntletSchema,
  },

  orf: {
    url: "https://id.embark.games/the-finals/leaderboards/orf",
    zodSchema: orfSchema,
  },
} satisfies Record<string, EmbarkApi>;

/**
 * Fetches the standard leaderboard data from the Embark "API".
 * Returns the validated entries, or throws an error if there was an issue.
 */
export const fetchStandardEmbarkLeaderboardData = async (api: EmbarkApi, cacheTtlSeconds?: number) => {
  const res = await fetch(api.url, {
    // Use Cloudflare's edge cache to coalesce concurrent requests and avoid cache stampede.
    // When multiple workers simultaneously miss the cache for the same URL, Cloudflare makes
    // only one upstream request to Embark and serves the response to all waiting workers.
    cf: cacheTtlSeconds ? { cacheEverything: true, cacheTtl: cacheTtlSeconds } : undefined,
  });
  const text = await res.text();
  const stringData = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/)?.[1];

  if (!res.ok) {
    throw new Error(`Failed to fetch data. URL ${res.url} returned status ${res.status}`);
  }

  if (!stringData) {
    throw new Error(`Failed to find __NEXT_DATA__ script tag on URL ${res.url}`);
  }

  const jsonData = JSON.parse(stringData);

  const { success, data } = api.zodSchema.safeParse(jsonData.props.pageProps.entries);
  if (!success) {
    throw new Error(`Failed to validate fetched data from URL ${res.url} with provided Zod schema.`);
  }

  return data;
};

/**
 * Fetches the standard community event data from the Embark "API".
 * Returns the validated entries and progress, or throws an error if there was an issue.
 */
export const fetchStandardEmbarkCommunityEventData = async (api: EmbarkApi, cacheTtlSeconds?: number) => {
  const res = await fetch(api.url, {
    cf: cacheTtlSeconds ? { cacheEverything: true, cacheTtl: cacheTtlSeconds } : undefined,
  });
  const text = await res.text();
  const stringData = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/)?.[1];

  if (!res.ok) {
    throw new Error(`Failed to fetch data. URL ${res.url} returned status ${res.status}`);
  }

  if (!stringData) {
    throw new Error(`Failed to find __NEXT_DATA__ script tag on URL ${res.url}`);
  }

  const jsonData = JSON.parse(stringData);

  const { success, data } = api.zodSchema.safeParse({
    entries: jsonData.props.pageProps.entries,
    progress: jsonData.props.pageProps.progress,
  });

  if (!success) {
    throw new Error(`Failed to validate fetched data from URL ${res.url} with provided Zod schema.`);
  }

  return data;
};

/** Fetches the standard leaderboard data from the Embark API using Cloudflare's edge cache.
 * Cloudflare coalesces concurrent cache misses for the same URL into a single upstream request,
 * preventing cache stampedes when the TTL expires.
 */
export const cachedFetchStandardEmbarkLeaderboardData = (api: EmbarkApi, ttlSeconds: number) =>
  fetchStandardEmbarkLeaderboardData(api, ttlSeconds);

/** Fetches the standard community event data from the Embark API using Cloudflare's edge cache.
 * Cloudflare coalesces concurrent cache misses for the same URL into a single upstream request,
 * preventing cache stampedes when the TTL expires.
 */
export const cachedFetchStandardEmbarkCommunityEventData = (api: EmbarkApi, ttlSeconds: number) =>
  fetchStandardEmbarkCommunityEventData(api, ttlSeconds);
