import { z } from "zod";

export const season3WorldTourSchema = z
  .object({
    r: z.number(),
    name: z.string(),
    p: z.number(),
    steam: z.string(),
    xbox: z.string(),
    psn: z.string(),
  })
  .transform(data => ({
    rank: data.r,
    name: data.name,
    steamName: data.steam,
    xboxName: data.xbox,
    psnName: data.psn,
    cashouts: data.p,
  }))
  .array();

export type Season3WorldTourUser = z.infer<
  typeof season3WorldTourSchema
>[number];
