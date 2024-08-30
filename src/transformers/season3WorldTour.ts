import { z } from "zod";

export const season3WorldTourSchema = z
  .object({
    // 2024-08-30: Embark either messed up or dislike community tools. All keys are now numbers instead of somewhat descriptive strings. Empty platform names are now 0 instead of empty strings.
    // r: z.number(),
    // name: z.string(),
    // p: z.number(),
    // steam: z.string(),
    // xbox: z.string(),
    // psn: z.string(),
    1: z.number(),
    3: z.string(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform(data => ({
    // 2024-08-30: Embark either messed up or dislike community tools
    // rank: data.r,
    // name: data.name,
    // steamName: data.steam,
    // xboxName: data.xbox,
    // psnName: data.psn,
    // cashouts: data.p,
    rank: data[1],
    name: data[3],
    steamName: data[6] === 0 ? "" : data[6],
    xboxName: data[7] === 0 ? "" : data[7],
    psnName: data[8] === 0 ? "" : data[8],
    cashouts: data[5],
  }))
  .array();

export type Season3WorldTourUser = z.infer<
  typeof season3WorldTourSchema
>[number];
