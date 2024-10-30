import { z } from "zod";
import leagueNumberToName from "../../utils/leagueNumberToName";
import nameFallback from "../../utils/nameFallback";
import {
  changePropertySchema,
  leagueNumberPropertySchema,
  leaguePropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  rankScorePropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const season3Schema = z
  .object({
    // 2024-08-30: Embark either messed up or dislike community tools. All keys are now numbers instead of somewhat descriptive strings. Empty platform names are now 0 instead of empty strings.
    // r: z.number(),
    // name: z.string(),
    // ri: z.number(),
    // p: z.number(),
    // ori: z.number(),
    // or: z.number(),
    // op: z.number(),
    // steam: z.string(),
    // xbox: z.string(),
    // psn: z.string(),
    1: z.number(),
    2: z.number(),
    3: z.string(),
    4: z.number(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform((data) => ({
    // 2024-08-30: Embark either messed up or dislike community tools
    // rank: data.r,
    // change: data.or - data.r,
    // name: data.name,
    // steamName: data.steam,
    // xboxName: data.xbox,
    // psnName: data.psn,
    // leagueNumber: data.ri,
    // league: leagueNumberToName(data.ri),
    // rankScore: data.p,
    rank: data[1],
    change: data[2],
    name: data[3],
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    leagueNumber: data[4],
    league: leagueNumberToName(data[4]),
    rankScore: data[5],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season3UserSchema = z
  .object({
    rank: rankPropertySchema,
    change: changePropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    leagueNumber: leagueNumberPropertySchema,
    league: leaguePropertySchema,
    rankScore: rankScorePropertySchema,
  })
  .openapi("Season3User", {
    title: "Season 3 User",
    description: "A user in the Season 3 leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season3Schema>[number]>;
