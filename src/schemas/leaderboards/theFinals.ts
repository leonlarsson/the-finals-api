import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  namePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  steamNamePropertySchema,
  tournamentWinsPropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

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
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    tournamentWins: data[5],
  }))
  .array();

// This is passed to the OpenAPI spec
export const theFinalsUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    tournamentWins: tournamentWinsPropertySchema,
  })
  .openapi("TheFinalsUser", {
    title: "The Finals User",
    description: "A user in the 'The Finals' leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof theFinalsSchema>[number]>;
