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
} from "./userProperties";

export const openBetaSchema = z
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
    league: fameToLeague("ob", data.f),
    fame: data.f,
    cashouts: data.c,
  }))
  .array();

export type OpenBetaUser = z.infer<typeof openBetaSchema>[number];

// This is passed to the OpenAPI spec
export const openBetaUserSchema = z
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
  .openapi("OpenBetaUser", {
    title: "Open Beta User",
    description: "A user in the Open Beta leaderboard.",
  }) satisfies z.ZodType<OpenBetaUser>;
