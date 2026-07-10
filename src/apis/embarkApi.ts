import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season11Schema } from "../schemas/leaderboards/season11";
import { season11PointBreakSchema } from "../schemas/leaderboards/season11PointBreak";
import { season11PowerShiftSchema } from "../schemas/leaderboards/season11PowerShift";
import { season11QuickCashSchema } from "../schemas/leaderboards/season11QuickCash";
import { season11SponsorSchema } from "../schemas/leaderboards/season11Sponsor";
import { season11TeamDeathmatchSchema } from "../schemas/leaderboards/season11TeamDeathmatch";
import { season11WorldTourSchema } from "../schemas/leaderboards/season11WorldTour";
import type { BaseUser } from "../types";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season11: {
    url: "https://id.embark.games/the-finals/leaderboards/s11",
    zodSchema: season11Schema,
  },
  season11Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s11s",
    zodSchema: season11SponsorSchema,
  },
  season11WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s11wt",
    zodSchema: season11WorldTourSchema,
  },
  season11PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s11ps",
    zodSchema: season11PowerShiftSchema,
  },
  season11QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s11qc",
    zodSchema: season11QuickCashSchema,
  },
  season11TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s11tdm",
    zodSchema: season11TeamDeathmatchSchema,
  },
  season11PointBreak: {
    url: "https://id.embark.games/the-finals/leaderboards/s11pb",
    zodSchema: season11PointBreakSchema,
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
