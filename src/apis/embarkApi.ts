import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season7Schema } from "../schemas/leaderboards/season7";
import { season7BlastOffSchema } from "../schemas/leaderboards/season7BlastOff";
import { season7PowerShiftSchema } from "../schemas/leaderboards/season7PowerShift";
import { season7QuickQashSchema } from "../schemas/leaderboards/season7QuickCash";
import { season7SponsorSchema } from "../schemas/leaderboards/season7Sponsor";
import { season7TeamDeathmatchSchema } from "../schemas/leaderboards/season7TeamDeathmatch";
import { season7TerminalAttackSchema } from "../schemas/leaderboards/season7TerminalAttack";
import { season7WorldTourSchema } from "../schemas/leaderboards/season7WorldTour";
import type { BaseUser } from "../types";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season7: {
    url: "https://id.embark.games/the-finals/leaderboards/s7",
    zodSchema: season7Schema,
  },
  season7Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s7s",
    zodSchema: season7SponsorSchema,
  },
  season7WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s7wt",
    zodSchema: season7WorldTourSchema,
  },
  season7TerminalAttack: {
    url: "https://id.embark.games/the-finals/leaderboards/s7ta",
    zodSchema: season7TerminalAttackSchema,
  },
  season7PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s7ps",
    zodSchema: season7PowerShiftSchema,
  },
  season7QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s7qc",
    zodSchema: season7QuickQashSchema,
  },
  season7TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s7tdm",
    zodSchema: season7TeamDeathmatchSchema,
  },
  season7BlastOff: {
    url: "https://id.embark.games/the-finals/leaderboards/s7bs",
    zodSchema: season7BlastOffSchema,
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
