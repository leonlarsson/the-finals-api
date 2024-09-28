import { z } from "zod";

export const season4SponsorSchema = z
  .object({
    1: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
    9: z.string(),
    10: z.number(),
  })
  .transform((data) => ({
    rank: data[1],
    name: typeof data[3] === "number" ? "Unknown#0000" : data[3],
    sponsor: data[9],
    fans: data[10],
    steamName: typeof data[6] === "number" ? "" : data[6],
    psnName: typeof data[7] === "number" ? "" : data[7],
    xboxName: typeof data[8] === "number" ? "" : data[8],
  }))
  .array();

export type Season4SponsorUser = z.infer<typeof season4SponsorSchema>[number];
