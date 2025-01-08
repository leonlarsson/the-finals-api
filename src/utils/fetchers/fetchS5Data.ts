export default async () => {
  const res = await fetch("https://id.embark.games/the-finals/leaderboards/s5");
  const text = await res.text();
  const stringData = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/)?.[1];

  if (!res.ok) {
    throw new Error(`Failed to fetch data. URL ${res.url} returned status ${res.status}`);
  }

  if (!stringData) {
    throw new Error(`Failed to find __NEXT_DATA__ script tag on URL ${res.url}`);
  }

  const jsonData = JSON.parse(stringData);

  // if (zodSchema) {
  //   const { success } = zodSchema.safeParse(jsonData.props.pageProps.entries);
  //   if (!success) {
  //     throw new Error(`Failed to validate fetched data from URL ${res.url} with provided Zod schema.`);
  //   }
  // }

  return jsonData.props.pageProps.entries;
};
