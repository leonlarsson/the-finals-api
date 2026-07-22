import { z } from "zod";
import nameFallback from "../../utils/nameFallback";
import {
  clubTagPropertySchema,
  clubUuidPropertySchema,
  fansPropertySchema,
  namePropertySchema,
  officialClubNamePropertySchema,
  psnNamePropertySchema,
  rankPropertySchema,
  sponsorPropertySchema,
  steamNamePropertySchema,
  xboxNamePropertySchema,
} from "../userProperties";

export const season11SponsorSchema = z
  .object({
    1: z.number(),
    // For some reason, the name can come back as a 0 (number) instead of a string. Example: {"1":4059,"2":57070,"3":0,"4":11,"5":25114,"6":"ඞ ⁧ AK","7":0,"8":0}
    3: z.union([z.string(), z.number()]),
    6: z.union([z.string(), z.number()]).optional(),
    7: z.union([z.string(), z.number()]).optional(),
    8: z.union([z.string(), z.number()]).optional(),
    9: z.string(),
    10: z.number(),
    12: z.union([z.string(), z.number()]).optional(),
    13: z.union([z.string(), z.number()]).optional(),
    officialClubName: z.string().optional(),
  })
  .transform((data) => ({
    rank: data[1],
    name: nameFallback(data[3], "Unknown#0000"),
    steamName: nameFallback(data[6]),
    psnName: nameFallback(data[7]),
    xboxName: nameFallback(data[8]),
    clubTag: nameFallback(data[12]),
    clubUuid: nameFallback(data[13]),
    officialClubName: data.officialClubName ?? "",
    sponsor: data[9],
    fans: data[10],
  }))
  .array();

// This is passed to the OpenAPI spec
export const season11SponsorUserSchema = z
  .object({
    rank: rankPropertySchema,
    name: namePropertySchema,
    steamName: steamNamePropertySchema,
    psnName: psnNamePropertySchema,
    xboxName: xboxNamePropertySchema,
    clubTag: clubTagPropertySchema,
    clubUuid: clubUuidPropertySchema,
    officialClubName: officialClubNamePropertySchema,
    sponsor: sponsorPropertySchema,
    fans: fansPropertySchema,
  })
  .openapi("Season11SponsorUser", {
    title: "Season 11 Sponsor User",
    description: "A user in the Season 11 Sponsor leaderboard.",
  }) satisfies z.ZodType<z.infer<typeof season11SponsorSchema>[number]>;
