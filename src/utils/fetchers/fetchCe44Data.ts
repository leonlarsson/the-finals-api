export default async () => {
  const res = await fetch("https://id.embark.games/the-finals/leaderboards/ce44");
  const text = await res.text();
  const stringData = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/)?.[1];

  if (!stringData) {
    return null;
  }

  try {
    const jsonData = JSON.parse(stringData);

    return {
      entries: jsonData.props.pageProps.entries,
      progress: jsonData.props.pageProps.progress,
    };
  } catch (error) {
    return null;
  }
};
