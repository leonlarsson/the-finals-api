import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  clubTagPropertySchema,
  fansPropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  sponsorPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const season7SponsorSchema = z
  .object({
    1: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    6: z.union([z.string(), z.number()]).optional(),
    7: z.union([z.string(), z.number()]).optional(),
    8: z.union([z.string(), z.number()]).optional(),
    9: z.string(),
    10: z.number(),
    12: z.union([z.string(), z.number()]).optional(),
  })
  .transform((data) => ({
    rank: data[1],
    name: nameFallback(data[3], "Unknown#0000"),
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    clubTag: nameFallback(data[12]),
    sponsor: data[9],
    fans: data[10],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season7SponsorUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    clubTag: clubTagPropertySchema,
    sponsor: sponsorPropertySchema,
    fans: fansPropertySchema,
  })
  .openapi("season7SponsorUser", {
    title: "Season 7 Sponsor User",
    description: "A user in the Season 7 Sponsor leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season7SponsorSchema>[number]>;
