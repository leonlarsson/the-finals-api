import type { ZodSchema } from "zod";
import { orfSchema } from "../schemas/leaderboards/orf";
import { season5Schema } from "../schemas/leaderboards/season5";
import { season5BankItSchema } from "../schemas/leaderboards/season5BankIt";
import { season5PowerShiftSchema } from "../schemas/leaderboards/season5PowerShift";
import { season5QuickQashSchema } from "../schemas/leaderboards/season5QuickCash";
import { season5SponsorSchema } from "../schemas/leaderboards/season5Sponsor";
import { season5TerminalAttackSchema } from "../schemas/leaderboards/season5TerminalAttack";
import { season5WorldTourSchema } from "../schemas/leaderboards/season5WorldTour";

export type EmbarkApi = {
  url: string;
  zodSchema: ZodSchema;
};

/** `embarkApi` lists the URL and Zod schema used to validate and transform the response for a leaderboard. */
export const embarkApi = {
  season5: {
    url: "https://id.embark.games/the-finals/leaderboards/s5",
    zodSchema: season5Schema,
  },
  season5Sponsor: {
    url: "https://id.embark.games/the-finals/leaderboards/s5s",
    zodSchema: season5SponsorSchema,
  },
  season5WorldTour: {
    url: "https://id.embark.games/the-finals/leaderboards/s5wt",
    zodSchema: season5WorldTourSchema,
  },
  season5TerminalAttack: {
    url: "https://id.embark.games/the-finals/leaderboards/s5ta",
    zodSchema: season5TerminalAttackSchema,
  },
  season5PowerShift: {
    url: "https://id.embark.games/the-finals/leaderboards/s5ps",
    zodSchema: season5PowerShiftSchema,
  },
  season5QuickCash: {
    url: "https://id.embark.games/the-finals/leaderboards/s5qc",
    zodSchema: season5QuickQashSchema,
  },
  season5BankIt: {
    url: "https://id.embark.games/the-finals/leaderboards/s5bi",
    zodSchema: season5BankItSchema,
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
