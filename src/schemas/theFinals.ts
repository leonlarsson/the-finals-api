import { z } from "zod";
import nameFallback from "../utils/nameFallback";

export const theFinalsSchema = z
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
    tournamentWins: data[5],
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
  }))
  .array();

export type TheFinalsUser = z.infer<typeof theFinalsSchema>[number];

// This is passed to OpenAPI
export const theFinalsUserSchema = z.object({
  rank: z.number(),
  name: z.string(),
  tournamentWins: z.number(),
  steamName: z.string(),
  psnName: z.string(),
  xboxName: z.string(),
}) satisfies z.ZodType<TheFinalsUser>;
