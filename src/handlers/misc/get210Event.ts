import { Context } from "hono";
import fetch210EventData from "../../utils/fetchers/fetch210EventData";

export default async (c: Context) => {
  const data = await fetch210EventData();
  if (data === null) {
    return c.json({ error: "No data found" }, 500);
  }

  try {
    return c.json({
      entries: data.entries,
      progress: data.progress,
    });
  } catch (error) {
    return c.json({ error: "Error parsing JSON" }, 500);
  }
};
