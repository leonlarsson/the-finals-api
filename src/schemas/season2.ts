import { z } from "zod";
import leagueNumberToName from "../utils/leagueNumberToName";

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

// This is passed to OpenAPI
export const season2UserSchema = z.object({
  rank: z.number(),
  change: z.number(),
  name: z.string(),
  steamName: z.string(),
  xboxName: z.string(),
  psnName: z.string(),
  leagueNumber: z.number(),
  league: z.string(),
  cashouts: z.number(),
}) satisfies z.ZodType<Season2User>;
