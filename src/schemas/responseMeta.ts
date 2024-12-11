import { z } from "zod";

export const responseMetaSchema = z
  .object({
    leaderboardVersion: z.string().openapi({ description: "The leaderboard version selected.", example: "s4" }),
    leaderboardPlatform: z
      .string()
      .optional()
      .openapi({ description: "The leaderboard platform selected.", example: "crossplay" }),
    dataSource: z.enum(["fetch", "kv", "backup"]).openapi({
      description:
        "The data source used.<br/><b>Fetch</b>: data was fetched from Embark.<br/><b>KV</b>: Data was fetched from KV (static storage).<br/><b>Backup</b>: Data was fetched from a backup KV, because the fetch to Embark failed.",
      example: "fetch",
    }),
    nameFilter: z.string().optional().openapi({ description: "The chosen name filter.", example: "ttv" }),
    returnCountOnly: z
      .boolean()
      .openapi({ description: "Whether the response only contains the count of the leaderboard.", example: false }),
  })
  .openapi({
    title: "Response Meta",
    description: "Metadata about the leaderboard response.",
  });
