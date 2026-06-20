export type LeaderboardRow = {
  window: "7d" | "30d" | "90d" | "all";
  model_name: string;
  model_slug: string;
  mae: number | null;
  rmse: number | null;
  directional_accuracy: number | null;
  prediction_count: number;
  rank: number | null;
};

export type LatestPrediction = {
  target_date: string;
  ticker: string;
  model_name: string;
  model_slug: string;
  reference_close: number;
  predicted_return: number;
  predicted_close: number;
};

export const scaffoldLeaderboard: LeaderboardRow[] = [
  {
    window: "30d",
    model_name: "Baseline",
    model_slug: "baseline",
    mae: null,
    rmse: null,
    directional_accuracy: null,
    prediction_count: 0,
    rank: null,
  },
];

export const scaffoldPredictions: LatestPrediction[] = [];
