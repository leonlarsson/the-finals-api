/**
 * Handles the fallback of a name if it is a number.
 * Fallback is an empty string by default.
 */
export default (name: string | number | undefined, fallback?: string) =>
  typeof name === "number" ? (fallback ?? "") : (name ?? "");
