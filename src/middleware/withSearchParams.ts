import { createMiddleware } from "hono/factory";
import type { HonoEnv } from "../types";

/** Middleware `withSearchParams` removes all search params from the URL that are not in the paramsToKeep array. Passing nothing means all params will be stripped */
export const withSearchParams = (paramsToKeep: string[] = []) =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const url = new URL(c.req.url);
    let foundInvalidSearchParams = false;

    for (const key of url.searchParams.keys()) {
      // If the key is not in the validSearchParams array, remove it from the search params
      if (!paramsToKeep.includes(key)) {
        url.searchParams.delete(key);
        foundInvalidSearchParams = true;
      }
    }

    // Redirect if search params were modified
    if (foundInvalidSearchParams) {
      return c.redirect(url.searchParams.size ? `${url.pathname}?${url.searchParams}` : url.pathname, 302);
    }

    await next();
  });
