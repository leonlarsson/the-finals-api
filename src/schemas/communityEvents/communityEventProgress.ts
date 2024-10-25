import { z } from "zod";

export const communityEventProgressSchema = z
  .object({
    currentProgress: z
      .number()
      .openapi({ description: "The current progress of the community event.", example: 11_333_777 }),
    goal: z.number().openapi({ description: "The goal of the community event.", example: 30_000_000 }),
  })
  .openapi("CommunityEventProgress", {
    title: "Community Event Progress",
    description: "The progress of a community event.",
  });
