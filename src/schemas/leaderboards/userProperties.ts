import { z } from "zod";

export const rankPropertySchema = z
  .number()
  .openapi({ description: "The user's rank in the leaderboard.", example: 1 });
export const changePropertySchema = z
  .number()
  .openapi({ description: "The change in rank. Usually 24 hours.", examples: [2, -4, 375] });
export const namePropertySchema = z
  .string()
  .openapi({ description: "The user's Embark name.", examples: ["Mozzy#3563", "SomeCoolOtter#8264"] });
export const steamNamePropertySchema = z.string().openapi({ description: "The user's Steam name.", example: "Mozzy" });
export const xboxNamePropertySchema = z.string().openapi({ description: "The user's Xbox name.", example: "" });
export const psnNamePropertySchema = z.string().openapi({ description: "The user's PlayStation name.", example: "" });
export const leaguePropertySchema = z.string().openapi({ description: "The user's league.", example: "Diamond 4" });
export const leagueNumberPropertySchema = z.number().openapi({ description: "The user's league number.", example: 20 });
export const famePropertySchema = z.number().openapi({ description: "The user's fame points." });
export const rankScorePropertySchema = z.number().openapi({ description: "The user's rank score." });
export const xpPropertySchema = z.number().openapi({ description: "The user's XP." });
export const levelPropertySchema = z.number().openapi({ description: "The user's level." });
export const cashoutsPropertySchema = z.number().openapi({ description: "The user's total amount of cashouts." });
export const scorePropertySchema = z.number().openapi({ description: "The user's score (pretty generic)." });
export const sponsorPropertySchema = z.string().openapi({ description: "The user's sponsor.", example: "HOLTOW" });
export const fansPropertySchema = z.number().openapi({ description: "The user's number of fans." });
export const tournamentWinsPropertySchema = z
  .number()
  .openapi({ description: "The user's number of tournament wins." });
