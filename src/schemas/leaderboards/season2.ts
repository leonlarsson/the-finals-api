import { z } from "zod";
import leagueNumberToName from "../../utils/leagueNumberToName";
import {
  cashoutsPropertySchema,
  changePropertySchema,
  leagueNumberPropertySchema,
  leaguePropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "./userProperties";

export const season2Schema = z
  .object({
    r: z.number(),
    name: z.string(),
    ri: z.number(),
    p: z.number(),
    ori: z.number(),
    or: z.number(),
    op: z.number(),
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
    leagueNumber: data.ri,
    league: leagueNumberToName(data.ri),
    cashouts: data.c,
  }))
  .array();

export type Season2User = z.infer<typeof season2Schema>[number];

// This is passed to the OpenAPI spec
export const season2UserSchema = z
  .object({
    rank: rankPropertySchema,
    change: changePropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    leagueNumber: leagueNumberPropertySchema,
    league: leaguePropertySchema,
    cashouts: cashoutsPropertySchema,
  })
  .openapi("Season2User", {
    title: "Season 2 User",
    description: "A user in the Season 2 leaderboard.",
  }) satisfies z.ZodType<Season2User>;
