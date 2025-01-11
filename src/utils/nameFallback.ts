/**
 * Returns a fallback if the given name is invalid.
 *
 * 1. If `name` is a number or an empty string, the fallback is returned.
 * 2. If `name` is `undefined`, the fallback is returned.
 * 3. Otherwise, the valid string `name` is returned.
 */
export default (name: string | number | undefined, fallback = ""): string => {
  if (typeof name === "number" || name === "") {
    return fallback;
  }

  return name ?? fallback;
};
