import { z } from "zod";
import fameToLeague from "../utils/fameToLeague";

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
  .transform(data => ({
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
