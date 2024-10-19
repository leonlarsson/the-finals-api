import { z } from "zod";
import fameToLeague from "../../utils/fameToLeague";
import {
  cashoutsPropertySchema,
  changePropertySchema,
  famePropertySchema,
  leaguePropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "./userProperties";

export const season1Schema = z
  .object({
    r: z.number(),
    name: z.string(),
    f: z.number(),
    of: z.number(),
    or: z.number(),
    c: z.number(),
    steam: z.string(),
    xbox: z.string(),
    psn: z.string(),
  })
  .transform((data) => ({
    rank: data.r,
    change: data.or - data.r,
    name: data.name,
    steamName: data.steam,
    xboxName: data.xbox,
    psnName: data.psn,
    league: fameToLeague("s1", data.f),
    fame: data.f,
    cashouts: data.c,
  }))
  .array();

export type Season1User = z.infer<typeof season1Schema>[number];

// This is passed to the OpenAPI spec
export const season1UserSchema = z
  .object({
    rank: rankPropertySchema,
    change: changePropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    league: leaguePropertySchema,
    fame: famePropertySchema,
    cashouts: cashoutsPropertySchema,
  })
  .openapi("Season1User", {
    title: "Season 1 User",
    description: "A user in the Season 1 leaderboard.",
  }) satisfies z.ZodType<Season1User>;
