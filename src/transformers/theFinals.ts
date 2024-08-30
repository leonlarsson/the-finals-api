import { z } from "zod";

export const theFinalsSchema = z
  .object({
    1: z.number(),
    3: z.string(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform(data => ({
    rank: data[1],
    name: data[3],
    tournamentWins: data[5],
    steamName: data[6] === 0 ? "" : data[6],
    psnName: data[7] === 0 ? "" : data[7],
    xboxName: data[8] === 0 ? "" : data[8],
  }))
  .array();
