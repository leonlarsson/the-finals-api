import { setSourceToBackup, setSourceToFetch } from "./fetchSource";
import { getJsonFromKV } from "./kv";

/** fetchWithKVFallback first attempts tp fetch data from the provided fetcher. If that fails (status not OK, script tag not found, or JSON.parse() fails), attempt to fetch backup data from KV using the provided key. */
// biome-ignore lint/suspicious/noExplicitAny: Data returned can either be an array or a community event object
export const fetchWithKVFallback = async (fetcher: () => Promise<any>, kv: KVNamespace, kvKey: string) => {
  try {
    const data = await fetcher();
    // If fetcher was successful, set the context to fetch
    setSourceToFetch();
    return data;
  } catch (fetchError) {
    console.error(`Failed to fetch data. Falling back to KV backup with key ${kvKey}`, fetchError);

    try {
      const backupData = await getJsonFromKV(kv, kvKey);
      // Since this is from backup data, set the context to backup.
      // getJsonFromKV() sets the context to kv, but this overrides it.
      setSourceToBackup();
      return backupData;
    } catch (backupError) {
      throw new Error(`${backupError} Original fetch error: ${fetchError}`, { cause: fetchError });
    }
  }
};
