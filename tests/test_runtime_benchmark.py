from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import numpy as np
import pandas as pd

from pipeline.benchmarking.runtime import run_runtime_benchmark, write_runtime_benchmark
from pipeline.config import Settings
from pipeline.forecasting.horizons import FORECAST_HORIZONS


class FakeTimesFMModel:
    def forecast(self, *, horizon: int, inputs: list[np.ndarray]):
        point_forecast = np.array([[100.0 + step for step in range(1, horizon + 1)]])
        quantile_forecast = np.zeros((1, horizon, 10))
        for step in range(horizon):
            point = point_forecast[0, step]
            quantile_forecast[0, step, 1] = point - 4.0
            quantile_forecast[0, step, 9] = point + 4.0
        return point_forecast, quantile_forecast


class FakeChronosModel:
    def predict_df(
        self,
        context: pd.DataFrame,
        *,
        prediction_length: int,
        quantile_levels: list[float],
        id_column: str,
        timestamp_column: str,
        target: str,
        freq: str,
    ) -> pd.DataFrame:
        latest_timestamp = pd.Timestamp(context[timestamp_column].iloc[-1])
        return pd.DataFrame(
            {
                "id": context[id_column].iloc[-1],
                "timestamp": pd.date_range(
                    latest_timestamp + pd.Timedelta(days=1),
                    periods=prediction_length,
                    freq="D",
                ),
                "predictions": [100.0 + step for step in range(1, prediction_length + 1)],
                "0.1": [96.0 + step for step in range(1, prediction_length + 1)],
                "0.5": [100.0 + step for step in range(1, prediction_length + 1)],
                "0.9": [104.0 + step for step in range(1, prediction_length + 1)],
            }
        )


class RuntimeBenchmarkTest(unittest.TestCase):
    def test_report_skips_heavy_models_by_default(self) -> None:
        with (
            patch("pipeline.benchmarking.runtime.build_feature_rows", return_value=[{}]),
            patch(
                "pipeline.benchmarking.runtime.train_and_predict",
                return_value=SimpleNamespace(prediction_rows=[{} for _ in range(12)]),
            ),
        ):
            report = run_runtime_benchmark(
                settings=Settings(),
                simple_ticker_count=2,
                adapter_ticker_count=1,
                price_days=20,
            )

        benchmarks = {row["name"]: row for row in report["benchmarks"]}
        self.assertEqual(benchmarks["Core simple models"]["status"], "completed")
        self.assertEqual(benchmarks["Core simple models"]["prediction_count"], 12)
        self.assertEqual(benchmarks["TimesFM"]["status"], "skipped")
        self.assertEqual(benchmarks["Chronos-2"]["status"], "skipped")
        self.assertIn("disabled", report["automation_recommendation"])

    def test_optional_adapter_loaders_can_be_benchmarked_without_real_dependencies(self) -> None:
        with (
            patch("pipeline.benchmarking.runtime.build_feature_rows", return_value=[{}]),
            patch(
                "pipeline.benchmarking.runtime.train_and_predict",
                return_value=SimpleNamespace(prediction_rows=[{} for _ in range(12)]),
            ),
            patch(
                "pipeline.benchmarking.runtime._measure_package_import",
                return_value={"seconds": None},
            ),
            patch("pipeline.benchmarking.runtime._huggingface_cache_size", return_value=123),
        ):
            report = run_runtime_benchmark(
                settings=Settings(),
                simple_ticker_count=1,
                adapter_ticker_count=1,
                price_days=280,
                include_timesfm=True,
                include_chronos=True,
                timesfm_model_loader=lambda _settings, _max_horizon: FakeTimesFMModel(),
                chronos_model_loader=lambda _settings: FakeChronosModel(),
            )

        benchmarks = {row["name"]: row for row in report["benchmarks"]}
        self.assertEqual(benchmarks["TimesFM"]["status"], "completed")
        self.assertEqual(benchmarks["TimesFM"]["prediction_count"], len(FORECAST_HORIZONS))
        self.assertEqual(benchmarks["TimesFM"]["model_download_bytes"], 123)
        self.assertEqual(benchmarks["Chronos-2"]["status"], "completed")
        self.assertEqual(benchmarks["Chronos-2"]["prediction_count"], len(FORECAST_HORIZONS))

    def test_write_runtime_benchmark_creates_json_report(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = write_runtime_benchmark({"benchmarks": []}, Path(directory) / "report.json")

            self.assertTrue(path.exists())
            self.assertIn('"benchmarks": []', path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
