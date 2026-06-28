import { useEffect, useState } from "react";
import { fetchTickerPriceChanges, type TickerPriceChange } from "../api/dashboardData";

// Session-level cache: the bulk trailing price-change snapshot (all horizons) is
// fetched at most once and shared across mounts of the /tickers page. A failed
// request is evicted so a later visit can retry.
let cachedPromise: Promise<Record<string, TickerPriceChange>> | null = null;

export function useTickerPriceChanges() {
  const [data, setData] = useState<Record<string, TickerPriceChange>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!cachedPromise) {
      cachedPromise = fetchTickerPriceChanges().catch((error) => {
        cachedPromise = null;
        throw error;
      });
    }

    cachedPromise
      .then((result) => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
