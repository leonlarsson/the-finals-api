import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  cashoutsPropertySchema,
  clubTagPropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const season7WorldTourSchema = z
  .object({
    1: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    // 25-01-11: One instance of 3 coming back as undefined. Only in this leaderboard so far.
    3: z.union([z.string(), z.number()]).optional(),
    5: z.number(),
    6: z.union([z.string(), z.number()]).optional(),
    7: z.union([z.string(), z.number()]).optional(),
    8: z.union([z.string(), z.number()]).optional(),
    12: z.union([z.string(), z.number()]).optional(),
  })
  .transform((data) => ({
    rank: data[1],
    name: nameFallback(data[3], "Unknown#0000"),
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    clubTag: nameFallback(data[12]),
    cashouts: data[5],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season7WorldTourUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    clubTag: clubTagPropertySchema,
    cashouts: cashoutsPropertySchema,
  })
  .openapi("Season7WorldTourUser", {
    title: "Season 7 World Tour User",
    description: "A user in the Season 7 World Tour leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season7WorldTourSchema>[number]>;
