import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season12Schema } from "../schemas/leaderboards/season12";
import { season12PointBreakSchema } from "../schemas/leaderboards/season12PointBreak";
import { season12PowerShiftSchema } from "../schemas/leaderboards/season12PowerShift";
import { season12QuickCashSchema } from "../schemas/leaderboards/season12QuickCash";
import { season12SoloShowdownSchema } from "../schemas/leaderboards/season12SoloShowdown";
import { season12SponsorSchema } from "../schemas/leaderboards/season12Sponsor";
import { season12TeamDeathmatchSchema } from "../schemas/leaderboards/season12TeamDeathmatch";
import { season12WorldTourSchema } from "../schemas/leaderboards/season12WorldTour";
import type { BaseUser } from "../types";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season12: {
    url: "https://id.embark.games/the-finals/leaderboards/s12",
    zodSchema: season12Schema,
  },
  season12Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s12s",
    zodSchema: season12SponsorSchema,
  },
  season12WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s12wt",
    zodSchema: season12WorldTourSchema,
  },
  season12PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s12ps",
    zodSchema: season12PowerShiftSchema,
  },
  season12QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s12qc",
    zodSchema: season12QuickCashSchema,
  },
  season12TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s12tdm",
    zodSchema: season12TeamDeathmatchSchema,
  },
  season12PointBreak: {
    url: "https://id.embark.games/the-finals/leaderboards/s12pb",
    zodSchema: season12PointBreakSchema,
  },
  season12SoloShowdown: {
    url: "https://id.embark.games/the-finals/leaderboards/s12ss",
    zodSchema: season12SoloShowdownSchema,
  },

  orf: {
    url: "https://id.embark.games/the-finals/leaderboards/orf",
    zodSchema: orfSchema,
  },
} satisfies Record<string, EmbarkApi>;

// Deduplicates concurrent Embark requests per PoP on KV cache miss.
// Errors get a short TTL so an Embark blip can't stick around for the full TTL.
const embarkCacheOptions = (cacheTtlSeconds?: number): RequestInitCfProperties | undefined =>
  cacheTtlSeconds
    ? { cacheEverything: true, cacheTtlByStatus: { "200-299": cacheTtlSeconds, "400-599": 30 } }
    : undefined;

// Best-effort cache fill. A 429 means another isolate is writing this key, so our write is redundant.
const putCache = (KV: KVNamespace, cacheKey: string, data: unknown, ttlSeconds: number) =>
  KV.put(cacheKey, JSON.stringify(data), { expirationTtl: ttlSeconds }).catch((e) => {
    const log = String(e).includes("429") ? console.warn : console.error;
    log(`KV PUT failed for key ${cacheKey}:`, e);
  });

const nextDataRegex = /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/;

// Returns pageProps from the page's __NEXT_DATA__, or throws.
const fetchEmbarkPageProps = async (api: EmbarkApi, cacheTtlSeconds?: number) => {
  const res = await fetch(api.url, { cf: embarkCacheOptions(cacheTtlSeconds) });

  if (!res.ok) {
    throw new Error(`Failed to fetch data. URL ${api.url} returned status ${res.status}`);
  }

  const stringData = (await res.text()).match(nextDataRegex)?.[1];
  if (!stringData) {
    throw new Error(`Failed to find __NEXT_DATA__ script tag on URL ${api.url}`);
  }

  return JSON.parse(stringData).props.pageProps;
};

/**
 * Fetches the standard leaderboard data from the Embark "API".
 * Returns the validated entries, or throws an error if there was an issue.
 */
export const fetchStandardEmbarkLeaderboardData = async (api: EmbarkApi, cacheTtlSeconds?: number) => {
  const pageProps = await fetchEmbarkPageProps(api, cacheTtlSeconds);

  const { success, data } = api.zodSchema.safeParse(pageProps.entries);
  if (!success) {
    throw new Error(`Failed to validate fetched data from URL ${api.url} with provided Zod schema.`);
  }

  return data;
};

/**
 * Fetches the standard community event data from the Embark "API".
 * Returns the validated entries and progress, or throws an error if there was an issue.
 */
export const fetchStandardEmbarkCommunityEventData = async (api: EmbarkApi, cacheTtlSeconds?: number) => {
  const pageProps = await fetchEmbarkPageProps(api, cacheTtlSeconds);

  const { success, data } = api.zodSchema.safeParse({
    entries: pageProps.entries,
    progress: pageProps.progress,
  });

  if (!success) {
    throw new Error(`Failed to validate fetched data from URL ${api.url} with provided Zod schema.`);
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
  ctx?.waitUntil(putCache(KV, cacheKey, data, ttlSeconds));
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
  ctx?.waitUntil(putCache(KV, cacheKey, data, ttlSeconds));
  return data;
};
