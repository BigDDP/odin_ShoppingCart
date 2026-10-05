import { useEffect, useState } from "react";

// Served from public/mock/items.json
const ITEMS_URL = "/mock/items.json";

export type Item = {
  id: number;
  cost: number;
  description: string;
  title: string;
  image: string;
  stockCount: number;
};

export type Items = Record<string, Item>;

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  return { data, error, loading };
};

export const useItems = () => useFetch<Items>(ITEMS_URL);
