import type { Context, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import type { Env } from "../types";

export const authentication = (c: Context<Env>, next: Next) => bearerAuth({ token: c.env.AUTH_TOKEN })(c, next);
