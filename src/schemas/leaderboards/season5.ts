import { z } from "zod";
import leagueNumberToName from "../../utils/leagueNumberToName";
import nameFallback from "../../utils/nameFallback";
import {
  changePropertySchema,
  clubTagPropertySchema,
  leagueNumberPropertySchema,
  leaguePropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  rankScorePropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const season5Schema = z
  .object({
    1: z.number(),
    2: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    4: z.number(),
    5: z.number(),
    6: z.union([z.string(), z.number()]).optional(),
    7: z.union([z.string(), z.number()]).optional(),
    8: z.union([z.string(), z.number()]).optional(),
    12: z.union([z.string(), z.number()]).optional(),
  })
  .transform((data) => ({
    rank: data[1],
    change: data[2],
    name: nameFallback(data[3], "Unknown#0000"),
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    clubTag: nameFallback(data[12]),
    leagueNumber: data[4],
    league: leagueNumberToName(data[4]),
    rankScore: data[5],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season5UserSchema = z
  .object({
    rank: rankPropertySchema,
    change: changePropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    clubTag: clubTagPropertySchema,
    leagueNumber: leagueNumberPropertySchema,
    league: leaguePropertySchema,
    rankScore: rankScorePropertySchema,
  })
  .openapi("Season5User", {
    title: "Season 5 User",
    description: "A user in the Season 5 leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season5Schema>[number]>;
