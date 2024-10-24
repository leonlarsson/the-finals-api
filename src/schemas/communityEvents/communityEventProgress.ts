import { z } from "zod";

export const communityEventProgressSchema = z
  .object({
    currentProgress: z.number().openapi({ description: "The current progress of the community event." }),
    goal: z.number().openapi({ description: "The goal of the community event." }),
  })
  .openapi("CommunityEventProgress", {
    title: "Community Event Progress",
    description: "The progress of a community event.",
  });
