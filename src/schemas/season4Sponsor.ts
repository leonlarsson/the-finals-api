import { z } from "zod";
import nameFallback from "../utils/nameFallback";

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
    name: nameFallback(data[3], "Unknown#0000"),
    sponsor: data[9],
    fans: data[10],
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
  }))
  .array();

export type Season4SponsorUser = z.infer<typeof season4SponsorSchema>[number];

// This is passed to OpenAPI
export const season4SponsorUserSchema = z
  .object({
    rank: z.number(),
    name: z.string(),
    sponsor: z.string(),
    fans: z.number(),
    steamName: z.string(),
    xboxName: z.string(),
    psnName: z.string(),
  })
  .array() satisfies z.ZodType<Season4SponsorUser[]>;
