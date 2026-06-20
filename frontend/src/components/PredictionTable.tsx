import type { LatestPrediction } from "../api/dashboardData";

type Props = {
  rows: LatestPrediction[];
};

export default function PredictionTable({ rows }: Props) {
  return (
    <section className="panel">
      <h2>Latest Predictions</h2>
      {rows.length === 0 ? (
        <p className="empty-state">Predictions will appear after the pipeline is implemented.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Model</th>
              <th>Return</th>
              <th>Predicted Close</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.target_date}-${row.ticker}-${row.model_slug}`}>
                <td>{row.ticker}</td>
                <td>{row.model_name}</td>
                <td>{(row.predicted_return * 100).toFixed(2)}%</td>
                <td>${row.predicted_close.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
