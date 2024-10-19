import { z } from "zod";
import leagueNumberToName from "../utils/leagueNumberToName";
import nameFallback from "../utils/nameFallback";

export const season4Schema = z
  .object({
    1: z.number(),
    2: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    4: z.number(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform((data) => ({
    rank: data[1],
    change: data[2],
    name: nameFallback(data[3], "Unknown#0000"),
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    leagueNumber: data[4],
    league: leagueNumberToName(data[4]),
    rankScore: data[5],
  }))
  .array();

export type Season4User = z.infer<typeof season4Schema>[number];

// This is passed to OpenAPI
export const season4UserSchema = z
  .object({
    rank: z.number(),
    change: z.number(),
    name: z.string(),
    steamName: z.string(),
    xboxName: z.string(),
    psnName: z.string(),
    leagueNumber: z.number(),
    league: z.string(),
    rankScore: z.number(),
  })
  .array() satisfies z.ZodType<Season4User[]>;
