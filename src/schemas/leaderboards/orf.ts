import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  scorePropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const orfSchema = z
  .object({
    1: z.number(),
    3: z.string(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform((data) => ({
    rank: data[1],
    name: data[3],
    score: data[5],
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
  }))
  .array();

// This is passed to the OpenAPI spec
export const orfUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    score: scorePropertySchema,
  })
  .openapi("ÖRFUser", {
    title: "ÖRF User",
    description: "A user in the ÖRF leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof orfSchema>[number]>;
