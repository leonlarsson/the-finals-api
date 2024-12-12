export default async () => {
  const res = await fetch("https://id.embark.games/the-finals/leaderboards/s4wt");
  const text = await res.text();
  const stringData = text.match(/<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/)?.[1];

  if (!res.ok) {
    // TODO: Remove me at some point
    console.error({
      resStatus: res.status,
      resStatusText: res.statusText,
      resUrl: res.url,
      resText: text,
    });
    throw new Error(`Failed to fetch data. URL ${res.url} returned status ${res.status}`);
  }

  if (!stringData) {
    throw new Error(`Failed to find __NEXT_DATA__ script tag on URL ${res.url}`);
  }

  const jsonData = JSON.parse(stringData);
  return jsonData.props.pageProps.entries;
};
