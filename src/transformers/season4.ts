import { z } from "zod";
import leagueNumberToName from "../utils/leagueNumberToName";

export const season4Schema = z
  .object({
    1: z.number(),
    2: z.number(),
    3: z.string(),
    4: z.number(),
    5: z.number(),
    6: z.union([z.string(), z.number()]),
    7: z.union([z.string(), z.number()]),
    8: z.union([z.string(), z.number()]),
  })
  .transform((data) => ({
    rank: data[1],
    change: data[2],
    name: data[3],
    steamName: typeof data[6] === "number" ? "" : data[6],
    psnName: typeof data[7] === "number" ? "" : data[7],
    xboxName: typeof data[8] === "number" ? "" : data[8],
    leagueNumber: data[4],
    league: leagueNumberToName(data[4]),
    rankScore: data[5],
  }))
  .array();

export type Season4User = z.infer<typeof season4Schema>[number];
