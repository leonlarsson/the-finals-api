import { cache as honoCache } from "hono/cache";

export const cache = (name: string, minutes: number) =>
  honoCache({
    cacheName: name,
    cacheControl: `public, max-age=${minutes * 60}, must-revalidate`,
  });
