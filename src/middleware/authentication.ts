import type { Context, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import type { CloudflareBindings } from "../types";

export const authentication = (c: Context<{ Bindings: CloudflareBindings }>, next: Next) =>
  bearerAuth({ token: c.env.AUTH_TOKEN })(c, next);
