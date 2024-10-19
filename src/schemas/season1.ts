import { z } from "zod";
import fameToLeague from "../utils/fameToLeague";

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

// This is passed to OpenAPI
export const season1UserSchema = z
  .object({
    rank: z.number(),
    change: z.number(),
    name: z.string(),
    steamName: z.string(),
    xboxName: z.string(),
    psnName: z.string(),
    league: z.string(),
    fame: z.number(),
    cashouts: z.number(),
  })
  .array() satisfies z.ZodType<Season1User[]>;
