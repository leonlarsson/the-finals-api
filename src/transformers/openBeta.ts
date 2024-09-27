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
