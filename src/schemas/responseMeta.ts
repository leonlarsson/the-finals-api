import { z } from "zod";

export const responseMetaSchema = z
  .object({
    leaderboardVersion: z.string().openapi({ description: "The leaderboard version selected.", example: "s4" }),
    leaderboardPlatform: z
      .string()
      .openapi({ description: "The leaderboard platform selected.", example: "crossplay" }),
    nameFilter: z.string().optional().openapi({ description: "The chosen name filter.", example: "ttv" }),
    returnCountOnly: z
      .boolean()
      .openapi({ description: "Whether the response only contains the count of the leaderboard." }),
  })
  .openapi({
    title: "Response Meta",
    description: "Metadata about the leaderboard response.",
  });
