import { z } from "zod";

// Parses a comma-separated query param (e.g. ?platforms=steam,xbox) into an array.
// Strict (default) rejects unknown values with a 400. Lenient silently drops them instead.
export const commaSeparatedQuerySchema = <T extends [string, ...string[]]>(
  paramName: string,
  allowedValues: T,
  options: { description: string; example: string; lenient?: boolean },
) => {
  const meta = {
    param: { name: paramName, in: "query" as const },
    description: options.description,
    example: options.example,
  };

  if (options.lenient) {
    return z
      .string()
      .optional()
      .transform((val) =>
        val
          ?.split(",")
          .map((v) => v.trim())
          .filter((v): v is T[number] => (allowedValues as readonly string[]).includes(v)),
      )
      .openapi(meta);
  }

  return z
    .string()
    .optional()
    .transform((val) => val?.split(",").map((v) => v.trim()))
    .pipe(z.array(z.enum(allowedValues)).optional())
    .openapi(meta);
};

// Parses a "true"/"false" query param (e.g. ?exactMatch=true) into a boolean. Defaults to false.
export const booleanQuerySchema = (paramName: string, options: { description: string; example?: "true" | "false" }) =>
  z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true")
    .openapi({
      param: { name: paramName, in: "query" as const },
      description: options.description,
      example: options.example ?? "false",
    });
