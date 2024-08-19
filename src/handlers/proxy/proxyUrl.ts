import { Context } from "hono";

export default async (c: Context) => {
  const { url } = c.req.query();
  if (!url) return c.json({ error: "No URL provided." }, 400);

  const response = await fetch(url);
  const data = await response.json();

  return c.json(data as any);
};
