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
import type { BaseUser } from "../types";

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
    // Deduplicates concurrent Embark requests per PoP on KV cache miss.
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

/** Caches the standard leaderboard data from the Embark API in KV storage.
 * If the data is already cached, it returns the cached data.
 * If not, it fetches the data from the API, caches it, and returns the fetched data.
 */
export const cachedFetchStandardEmbarkLeaderboardData = async (
  api: EmbarkApi,
  KV: KVNamespace,
  ttlSeconds: number,
  ctx?: Pick<ExecutionContext, "waitUntil">,
) => {
  // If the data we're fetching is cached, return it immediately
  const cacheKey = `cache_${new URL(api.url).pathname}`;
  const cached = await KV.get<BaseUser[]>(cacheKey, { type: "json" });
  if (cached !== null) {
    return cached;
  }

  // Fetch data from the Embark API
  const data = await fetchStandardEmbarkLeaderboardData(api, ttlSeconds);

  // Store the parsed data in KV with the specified TTL
  ctx?.waitUntil(
    KV.put(cacheKey, JSON.stringify(data), { expirationTtl: ttlSeconds }).catch((e) =>
      console.error(`KV PUT failed for key ${cacheKey}:`, e),
    ),
  );
  return data;
};

/**
 * Caches the standard community event data from the Embark API in KV storage.
 * If the data is already cached, it returns the cached data.
 * If not, it fetches the data from the API, caches it, and returns the fetched data.
 */
export const cachedFetchStandardEmbarkCommunityEventData = async (
  api: EmbarkApi,
  KV: KVNamespace,
  ttlSeconds: number,
  ctx?: ExecutionContext,
) => {
  // If the data we're fetching is cached, return it immediately
  const cacheKey = `cache_${new URL(api.url).pathname}`;
  const cached = await KV.get(cacheKey, { type: "json" });
  if (cached !== null) {
    return cached;
  }

  // Fetch data from the Embark API
  const data = await fetchStandardEmbarkCommunityEventData(api, ttlSeconds);

  // Store the parsed data in KV with the specified TTL
  ctx?.waitUntil(
    KV.put(cacheKey, JSON.stringify(data), { expirationTtl: ttlSeconds }).catch((e) =>
      console.error(`KV PUT failed for key ${cacheKey}:`, e),
    ),
  );
  return data;
};
