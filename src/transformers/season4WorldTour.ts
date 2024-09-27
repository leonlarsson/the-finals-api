import { z } from "zod";

export const season4WorldTourSchema = z
  .object({
    1: z.number(),
    3: z.string(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform(data => ({
    rank: data[1],
    name: data[3],
    steamName: typeof data[6] === "number" ? "" : data[6],
    psnName: typeof data[7] === "number" ? "" : data[7],
    xboxName: typeof data[8] === "number" ? "" : data[8],
    cashouts: data[5],
  }))
  .array();

export type Season4WorldTourUser = z.infer<
  typeof season4WorldTourSchema
>[number];
