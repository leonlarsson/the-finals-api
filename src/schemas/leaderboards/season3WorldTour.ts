import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  cashoutsPropertySchema,
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

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
  .transform((data) => ({
    // 2024-08-30: Embark either messed up or dislike community tools
    // rank: data.r,
    // name: data.name,
    // steamName: data.steam,
    // xboxName: data.xbox,
    // psnName: data.psn,
    // cashouts: data.p,
    rank: data[1],
    name: data[3],
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    cashouts: data[5],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season3WorldTourUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    cashouts: cashoutsPropertySchema,
  })
  .openapi("Season3WorldTourUser", {
    title: "Season 3 World Tour User",
    description: "A user in the Season 3 World Tour leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season3WorldTourSchema>[number]>;
