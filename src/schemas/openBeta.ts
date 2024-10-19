import { z } from "zod";
import fameToLeague from "../utils/fameToLeague";

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

// This is passed to OpenAPI
export const openBetaUserSchema = z.object({
  rank: z.number(),
  change: z.number(),
  name: z.string(),
  steamName: z.string(),
  xboxName: z.string(),
  psnName: z.string(),
  league: z.string(),
  fame: z.number(),
  cashouts: z.number(),
}) satisfies z.ZodType<OpenBetaUser>;
