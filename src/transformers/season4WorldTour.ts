import { z } from "zod";

export const season4WorldTourSchema = z
  .object({
    1: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform((data) => ({
    rank: data[1],
    name: data[3] || "Unknown#0000",
    steamName: data[6] || "",
    psnName: data[7] || "",
    xboxName: data[8] || "",
    cashouts: data[5],
  }))
  .array();

export type Season4WorldTourUser = z.infer<typeof season4WorldTourSchema>[number];
