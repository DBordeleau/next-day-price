import { scaffoldLeaderboard, scaffoldPredictions } from "../api/dashboardData";
import DashboardHeader from "../components/DashboardHeader";
import LeaderboardTable from "../components/LeaderboardTable";
import MetricCard from "../components/MetricCard";
import PredictionTable from "../components/PredictionTable";
import TickerChart from "../components/TickerChart";

export default function Dashboard() {
  return (
    <main className="dashboard-shell">
      <DashboardHeader />
      <section className="metrics-row">
        <MetricCard label="Best 30D Model" value="Pending" />
        <MetricCard label="Directional Leader" value="Pending" />
        <MetricCard label="Baseline Rank" value="Pending" />
        <MetricCard label="Scored Predictions" value="0" />
      </section>
      <div className="dashboard-grid">
        <LeaderboardTable rows={scaffoldLeaderboard} />
        <PredictionTable rows={scaffoldPredictions} />
      </div>
      <TickerChart />
    </main>
  );
}
