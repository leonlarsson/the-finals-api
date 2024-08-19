import { Context } from "hono";

export default async (c: Context) => {
  const res = await fetch("https://id.embark.games/leaderboards/the-finals");
  const text = await res.text();
  const stringData = text.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/
  )?.[1];

  if (!stringData) {
    return c.json({ error: "No data found" }, 500);
  }

  try {
    const jsonData = JSON.parse(stringData);
    return c.json({
      entries: jsonData.props.pageProps.entries,
      progress: jsonData.props.pageProps.progress,
    });
  } catch (error) {
    return c.json({ error: "Error parsing JSON" }, 500);
  }
};
