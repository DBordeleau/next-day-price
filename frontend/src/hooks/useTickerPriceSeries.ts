import { useEffect, useMemo, useState } from "react";
import {
  fetchRecentDailyCloses,
  type DailyPricePoint,
} from "../api/livePrices";

type TickerPriceSeriesState = {
  daily: DailyPricePoint[];
  loading: boolean;
  error: string | null;
};

const emptySeries: TickerPriceSeriesState = {
  daily: [],
  loading: false,
  error: null,
};

export function useTickerPriceSeries(ticker: string): TickerPriceSeriesState {
  const normalizedTicker = ticker.trim().toUpperCase();
  const [daily, setDaily] = useState<DailyPricePoint[]>([]);
  const [loading, setLoading] = useState(Boolean(normalizedTicker));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!normalizedTicker) {
      setDaily([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetchRecentDailyCloses(normalizedTicker)
      .then((nextDaily) => {
        if (!active) {
          return;
        }
        setDaily(nextDaily);
      })
      .catch((caught) => {
        if (!active) {
          return;
        }
        setDaily([]);
        setError(caught instanceof Error ? caught.message : "Unable to load price history.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [normalizedTicker]);

  return useMemo(
    () =>
      normalizedTicker
        ? { daily, loading, error }
        : emptySeries,
    [daily, error, loading, normalizedTicker],
  );
}
