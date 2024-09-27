import type { Context } from "hono";

export default async (c: Context) => {
  const { url } = c.req.query();
  if (!url) return c.json({ error: "No URL provided." }, 400);
  return fetch(url);
};
