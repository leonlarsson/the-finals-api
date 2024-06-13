import { Context } from "hono";
import fetchS3WorldTourData from "../../utils/fetchers/fetchS3WorldTourData";

export default async (c: Context) => {
  const data = await fetchS3WorldTourData();
  if (data === null) {
    return c.json({ error: "No data found" }, 500);
  }

  try {
    return c.json({
      data,
    });
  } catch (error) {
    return c.json({ error: "Error parsing JSON" }, 500);
  }
};
