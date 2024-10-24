import { z } from "zod";
import fameToLeague from "../../utils/fameToLeague";
import {
  cashoutsPropertySchema,
  changePropertySchema,
  famePropertySchema,
  leaguePropertySchema,
  levelPropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
  xpPropertySchema,
} from "../userProperties";

export const closedBeta1Schema = z
  .object({
    r: z.number(),
    name: z.string(),
    f: z.number(),
    of: z.number(),
    or: z.number(),
    x: z.number(),
    mx: z.number(),
    c: z.number(),
  })
  .transform((data) => ({
    rank: data.r,
    change: data.or - data.r,
    name: data.name,
    steamName: "",
    xboxName: "",
    psnName: "",
    league: fameToLeague("cb1", data.f),
    fame: data.f,
    xp: data.x,
    level: data.mx,
    cashouts: data.c,
  }))
  .array();

export type ClosedBeta1User = z.infer<typeof closedBeta1Schema>[number];

// This is passed to the OpenAPI spec
export const closedBeta1UserSchema = z
  .object({
    rank: rankPropertySchema,
    change: changePropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    league: leaguePropertySchema,
    fame: famePropertySchema,
    xp: xpPropertySchema,
    level: levelPropertySchema,
    cashouts: cashoutsPropertySchema,
  })
  .openapi("ClosedBeta1User", {
    title: "Closed Beta 1 User",
    description: "A user in the Closed Beta 1 leaderboard.",
  }) satisfies z.ZodType<ClosedBeta1User>;
