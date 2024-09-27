/** Performs .get() on a KVNamespace with a default cacheTtl of 86_400 (24 hours). Returned data is json. */
export const getJsonFromKV = async (KV: KVNamespace, key: string, cacheTtl = 86_400) => {
  return await KV.get(key, { type: "json", cacheTtl });
};
