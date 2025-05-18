import type { Context, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import type { HonoEnv } from "../types";

export const authentication = (c: Context<HonoEnv>, next: Next) => bearerAuth({ token: c.env.AUTH_TOKEN })(c, next);
