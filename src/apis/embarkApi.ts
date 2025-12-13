import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season9Schema } from "../schemas/leaderboards/season9";
import { season9CashoutSchema } from "../schemas/leaderboards/season9Cashout";
import { season9Head2HeadSchema } from "../schemas/leaderboards/season9Head2Head";
import { season9PointBreakSchema } from "../schemas/leaderboards/season9PointBreak";
import { season9PowerShiftSchema } from "../schemas/leaderboards/season9PowerShift";
import { season9QuickCashSchema } from "../schemas/leaderboards/season9QuickCash";
import { season9SponsorSchema } from "../schemas/leaderboards/season9Sponsor";
import { season9TeamDeathmatchSchema } from "../schemas/leaderboards/season9TeamDeathmatch";
import type { BaseUser } from "../types";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season9: {
    url: "https://id.embark.games/the-finals/leaderboards/s9",
    zodSchema: season9Schema,
  },
  season9Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s9s",
    zodSchema: season9SponsorSchema,
  },
  season9Cashout: {
    url: "https://id.embark.games/the-finals/leaderboards/s9wt",
    zodSchema: season9CashoutSchema,
  },
  season9Head2Head: {
    url: "https://id.embark.games/the-finals/leaderboards/s9h2h",
    zodSchema: season9Head2HeadSchema,
  },
  season9PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s9ps",
    zodSchema: season9PowerShiftSchema,
  },
  season9QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s9qc",
    zodSchema: season9QuickCashSchema,
  },
  season9TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s9tdm",
    zodSchema: season9TeamDeathmatchSchema,
  },
  season9PointBreak: {
    url: "https://id.embark.games/the-finals/leaderboards/s9pb",
    zodSchema: season9PointBreakSchema,
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
export const fetchStandardEmbarkLeaderboardData = async (api: EmbarkApi) => {
  const res = await fetch(api.url);
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
export const fetchStandardEmbarkCommunityEventData = async (api: EmbarkApi) => {
  const res = await fetch(api.url);
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
  const data = await fetchStandardEmbarkLeaderboardData(api);

  // Store the parsed data in KV with the specified TTL
  ctx?.waitUntil(KV.put(cacheKey, JSON.stringify(data), { expirationTtl: ttlSeconds }));
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
  const data = await fetchStandardEmbarkCommunityEventData(api);

  // Store the parsed data in KV with the specified TTL
  ctx?.waitUntil(KV.put(cacheKey, JSON.stringify(data), { expirationTtl: ttlSeconds }));
  return data;
};
