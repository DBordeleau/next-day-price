import { useState } from "react";
import type { MetricWindow } from "../api/dashboardData";
import TickerChart from "../components/charts/TickerChart";
import AnimatedSection from "../components/layout/AnimatedSection";
import DashboardFooter from "../components/layout/DashboardFooter";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardShell from "../components/layout/DashboardShell";
import LeaderboardChart from "../components/leaderboard/LeaderboardChart";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import WindowSelector from "../components/leaderboard/WindowSelector";
import MetricStrip from "../components/metrics/MetricStrip";
import PredictionTable from "../components/predictions/PredictionTable";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const [window, setWindow] = useState<MetricWindow>("7d");
  const dashboard = useDashboardData();

  return (
    <DashboardShell
      error={dashboard.error}
      hasSupabaseConfig={dashboard.hasSupabaseConfig}
      onRetry={dashboard.refetch}
    >
      <AnimatedSection delay={0}>
        <DashboardHeader />
      </AnimatedSection>
      <AnimatedSection delay={0.08}>
        <div className="page-window-control">
          <WindowSelector value={window} onChange={setWindow} className="prominent-window-selector" />
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.14}>
        <MetricStrip
          leaderboard={dashboard.leaderboard}
          window={window}
          loading={dashboard.loading}
        />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <LeaderboardTable
          rows={dashboard.leaderboard}
          window={window}
          loading={dashboard.loading}
        />
      </AnimatedSection>
      <div className="dashboard-grid">
        <div className="dashboard-primary">
          <AnimatedSection delay={0.26}>
            <TickerChart
              history={dashboard.tickerHistory}
              predictions={dashboard.latestPredictions}
              selectedTicker={dashboard.selectedTicker}
              onTickerChange={dashboard.setSelectedTicker}
              loading={dashboard.historyLoading || dashboard.loading}
            />
          </AnimatedSection>
        </div>
        <div className="dashboard-secondary">
          <AnimatedSection delay={0.32}>
            <LeaderboardChart rows={dashboard.leaderboard} window={window} loading={dashboard.loading} />
          </AnimatedSection>
          <AnimatedSection delay={0.38}>
            <PredictionTable rows={dashboard.latestPredictions} loading={dashboard.loading} collapsible />
          </AnimatedSection>
        </div>
      </div>
      <AnimatedSection delay={0.44}>
        <DashboardFooter metadata={dashboard.metadata} loading={dashboard.loading} />
      </AnimatedSection>
    </DashboardShell>
  );
}
