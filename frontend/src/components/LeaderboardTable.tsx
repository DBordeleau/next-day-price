import type { LeaderboardRow } from "../api/dashboardData";

type Props = {
  rows: LeaderboardRow[];
};

export default function LeaderboardTable({ rows }: Props) {
  return (
    <section className="panel">
      <h2>Model Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Model</th>
            <th>Window</th>
            <th>MAE</th>
            <th>Directional</th>
            <th>Scored</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.window}-${row.model_slug}`}>
              <td>{row.rank ?? "-"}</td>
              <td>{row.model_name}</td>
              <td>{row.window}</td>
              <td>{row.mae?.toFixed(3) ?? "Pending"}</td>
              <td>
                {row.directional_accuracy == null
                  ? "Pending"
                  : `${(row.directional_accuracy * 100).toFixed(1)}%`}
              </td>
              <td>{row.prediction_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
