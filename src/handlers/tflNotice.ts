import type { Context } from "hono";

export default async (c: Context<{ Bindings: CloudflareBindings }>) => {
  const noticeMessage = await c.env.KV.get("tfl-notice");

  if (!noticeMessage) {
    return c.json({ type: null, message: null });
  }

  const [type, message] = noticeMessage.split("|");

  return c.json({ type, message });
};
