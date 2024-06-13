import { season3WorldTourSchema } from "../../transformers/season3WorldTour";

export default async () => {
  const res = await fetch("https://id.embark.games/leaderboards/world-tour");
  const text = await res.text();
  const stringData = text.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/
  )?.[1];

  if (!stringData) {
    return null;
  }

  try {
    const jsonData = JSON.parse(stringData);

    // Validate and parse data with Zod schema
    const parsedResult = season3WorldTourSchema.safeParse(
      jsonData.props.pageProps.entries
    );

    if (!parsedResult.success) {
      throw new Error(parsedResult.error.toString());
    }
    return parsedResult.data;
  } catch (error) {
    console.log("Error in fetchS3WorldTourData:", error);
    return null;
  }
};
