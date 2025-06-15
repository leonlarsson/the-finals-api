import type { BaseUser } from "../types";
import { setSourceToKV } from "./fetchSource";

/** Performs .get() on a KVNamespace with a default cacheTtl of 86_400 (24 hours). Returned data is json. */
export const getJsonFromKV = async (KV: KVNamespace, key: string, cacheTtl = 86_400): Promise<BaseUser[]> => {
  const data = await KV.get<BaseUser[]>(key, { type: "json", cacheTtl });
  if (!data) {
    throw new Error(`No data found in KV for key: ${key}`);
  }

  setSourceToKV();
  return data;
};
