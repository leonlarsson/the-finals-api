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
import { communityEventProgressSchema } from "./communityEventProgress";

export const ce48Schema = z.object({
  entries: z
    .object({
      1: z.number(),
      // Same username issue as Season 4
      3: z.union([z.string(), z.number()]),
      5: z.number(),
      6: z.union([z.string(), z.number()]),
      7: z.union([z.string(), z.number()]),
      8: z.union([z.string(), z.number()]),
    })
    .transform((data) => ({
      rank: data[1],
      name: nameFallback(data[3], "Unknown#0000"),
      steamName: nameFallback(data[6]),
      psnName: nameFallback(data[7]),
      xboxName: nameFallback(data[8]),
      score: data[5],
    }))
    .array(),
  progress: communityEventProgressSchema,
});

// This is passed to the OpenAPI spec
export const ce48ResponseSchema = z.object({
  progress: communityEventProgressSchema,
  entries: z
    .object({
      rank: rankPropertySchema,
      name: namePropertySchema,
      steamName: steamNamePropertySchema,
      psnName: psnNamePropertySchema,
      xboxName: xboxNamePropertySchema,
      score: scorePropertySchema,
    })
    .openapi("CE48User", { title: "Community Event 4.8 User", description: "A user in Community Event 4.8." })
    .array(),
}) satisfies z.ZodType<z.infer<typeof ce48Schema>>;
