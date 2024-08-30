import { Context } from "hono";
import { theFinalsSchema } from "../../transformers/theFinals";

export default async (c: Context) => {
  const res = await fetch("https://id.embark.games/leaderboards/wttf");
  const text = await res.text();
  const stringData = text.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/
  )?.[1];

  if (!stringData) {
    return c.json({ error: "No data found" }, 500);
  }

  try {
    const jsonData = JSON.parse(stringData);
    const parsedData = theFinalsSchema.parse(jsonData.props.pageProps.entries);
    return c.json(parsedData);
  } catch (error) {
    return c.json({ error: "Error parsing JSON" }, 500);
  }
};
