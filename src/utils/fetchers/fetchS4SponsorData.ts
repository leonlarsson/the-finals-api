export default async () => {
  const res = await fetch("https://id.embark.games/leaderboards/s4s");
  const text = await res.text();
  const stringData = text.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/
  )?.[1];

  if (!stringData) {
    return null;
  }

  try {
    const jsonData = JSON.parse(stringData);
    return jsonData.props.pageProps.entries;
  } catch (error) {
    return null;
  }
};
