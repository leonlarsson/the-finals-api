import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season6Schema } from "../schemas/leaderboards/season6";
import { season6HeavyHittersSchema } from "../schemas/leaderboards/season6HeavyHitters";
import { season6PowerShiftSchema } from "../schemas/leaderboards/season6PowerShift";
import { season6QuickQashSchema } from "../schemas/leaderboards/season6QuickCash";
import { season6SponsorSchema } from "../schemas/leaderboards/season6Sponsor";
import { season6TeamDeathmatchSchema } from "../schemas/leaderboards/season6TeamDeathmatch";
import { season6TerminalAttackSchema } from "../schemas/leaderboards/season6TerminalAttack";
import { season6WorldTourSchema } from "../schemas/leaderboards/season6WorldTour";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season6: {
    url: "https://id.embark.games/the-finals/leaderboards/s6",
    zodSchema: season6Schema,
  },
  season6Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s6s",
    zodSchema: season6SponsorSchema,
  },
  season6WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s6wt",
    zodSchema: season6WorldTourSchema,
  },
  season6TerminalAttack: {
    url: "https://id.embark.games/the-finals/leaderboards/s6ta",
    zodSchema: season6TerminalAttackSchema,
  },
  season6PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s6ps",
    zodSchema: season6PowerShiftSchema,
  },
  season6QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s6qc",
    zodSchema: season6QuickQashSchema,
  },
  season6TeamDeathmatch: {
    url: "https://id.embark.games/the-finals/leaderboards/s6tdm",
    zodSchema: season6TeamDeathmatchSchema,
  },
  season6HeavyHitters: {
    url: "https://id.embark.games/the-finals/leaderboards/s6hh",
    zodSchema: season6HeavyHittersSchema,
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
