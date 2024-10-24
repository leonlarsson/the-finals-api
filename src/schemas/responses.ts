import { type ZodSchema, z } from "zod";
import { communityEventProgressSchema } from "./communityEvents/communityEventProgress";
import { responseMetaSchema } from "./responseMeta";

export const leaderboard200ResponseSchema = (leaderboardUserSchema: ZodSchema) =>
  z.object({
    meta: responseMetaSchema,
    count: z.number().openapi({ description: "The number of entries returned. 10,000 is the max." }),
    data: leaderboardUserSchema.array(),
  });

export const communityEvent200ResponseSchema = (responseSchema: ZodSchema) =>
  z.object({
    meta: responseMetaSchema,
    count: z.number().openapi({ description: "The number of entries returned. 10,000 is the max." }),
    data: responseSchema,
  });

export const leaderboard404ResponseSchema = z.object({
  error: z.string(),
});

export const leaderboard500ResponseSchema = z.object({
  error: z.string(),
  zodError: z.any().optional(),
});
