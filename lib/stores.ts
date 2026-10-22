import { STORE_IDS, type GiftCategory, type StoreId } from "@/lib/recommendation-schema";

type Store = { id: StoreId; label: string; host: string; buildUrl: (query: string) => string };

const encode = (query: string) => encodeURIComponent(query.trim());

export const stores: Record<StoreId, Store> = {
  amazon_sa: {
    id: "amazon_sa", label: "Amazon.sa", host: "www.amazon.sa",
    buildUrl: (query) => `https://www.amazon.sa/s?k=${encode(query)}`,
  },
  noon: {
    id: "noon", label: "Noon", host: "www.noon.com",
    buildUrl: (query) => `https://www.noon.com/saudi-en/search/?q=${encode(query)}`,
  },
  shein: {
    id: "shein", label: "SHEIN", host: "ar.shein.com",
    buildUrl: (query) => `https://ar.shein.com/pdsearch/${encode(query)}`,
  },
  aliexpress: {
    id: "aliexpress", label: "AliExpress", host: "www.aliexpress.com",
    buildUrl: (query) => `https://www.aliexpress.com/wholesale?SearchText=${encode(query)}`,
  },
  jarir: {
    id: "jarir", label: "Jarir", host: "www.jarir.com",
    buildUrl: (query) => `https://www.jarir.com/sa-en/catalogsearch/result/?q=${encode(query)}`,
  },
  extra: {
    id: "extra", label: "eXtra", host: "www.extra.com",
    buildUrl: (query) => `https://www.extra.com/en-sa/search/?text=${encode(query)}`,
  },
};

const categoryFallback: Record<GiftCategory, StoreId[]> = {
  electronics: ["amazon_sa", "noon", "jarir", "extra"],
  fashion: ["shein", "amazon_sa", "noon"],
  home: ["shein", "amazon_sa", "noon"],
  beauty: ["shein", "amazon_sa", "noon"],
  "books and stationery": ["jarir", "amazon_sa", "noon"],
  "food and treats": ["amazon_sa", "noon"],
  "hobbies and creative": ["aliexpress", "amazon_sa", "noon"],
  experiences: ["amazon_sa", "noon"],
  other: ["amazon_sa", "noon"],
};

export function buildStoreLinks(ids: string[], category: GiftCategory, query: string) {
  const allowlisted = [...new Set(ids.filter((id): id is StoreId => (STORE_IDS as readonly string[]).includes(id)))];
  const selected = allowlisted.length ? allowlisted.slice(0, 4) : categoryFallback[category];

  return selected.map((id) => {
    const store = stores[id];
    const url = new URL(store.buildUrl(query));
    if (url.protocol !== "https:" || url.hostname !== store.host) {
      throw new Error("Store link did not match its trusted host.");
    }
    return { id, label: store.label, url: url.toString() };
  });
}
