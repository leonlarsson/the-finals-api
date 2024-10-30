import { getJsonFromKV } from "./kv";

/** fetchWithKVFallback first attempts tp fetch data from the provided fetcher. If that fails (status not OK, script tag not found, or JSON.parse() fails), attempt to fetch backup data from KV using the provided key. */
// biome-ignore lint/suspicious/noExplicitAny: Data returned can either be an array or a community event object
export const fetchWithKVFallback = async (fetcher: () => Promise<any>, kv: KVNamespace, kvKey: string) => {
  try {
    return await fetcher();
  } catch (e) {
    console.error(`Failed to fetch data. Falling back to KV backup with key ${kvKey}`, e);
    const backupData = await getJsonFromKV(kv, kvKey);
    return backupData ?? console.error(`Failed to fetch data and no backup data found in KV with key ${kvKey}`);
  }
};
