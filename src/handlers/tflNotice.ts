import { Context } from "hono";
import { Bindings } from "../types";

export default async (c: Context<{ Bindings: Bindings }>) => {
  const noticeMessage = await c.env.KV.get("tfl-notice");

  if (!noticeMessage) {
    return c.json({ error: "No notice found" }, 404);
  }

  const [type, message] = noticeMessage.split("|");

  return c.json({ type, message });
};
