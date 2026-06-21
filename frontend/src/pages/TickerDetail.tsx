import { Card, Group, Skeleton, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import TickerChart from "../components/charts/TickerChart";
import AnimatedSection from "../components/layout/AnimatedSection";
import BackToDashboardButton from "../components/layout/BackToDashboardButton";
import DashboardFooter from "../components/layout/DashboardFooter";
import SectionPanel from "../components/layout/SectionPanel";
import PredictionTable from "../components/predictions/PredictionTable";
import { useDashboardData } from "../hooks/useDashboardData";
import { useTickerHistory } from "../hooks/useTickerHistory";
import { formatCurrency, formatDate } from "../utils/format";

export default function TickerDetail() {
  const { ticker = "" } = useParams();
  const dashboard = useDashboardData();
  const tickerHistory = useTickerHistory(ticker);
  const predictions = dashboard.latestPredictions.filter((row) => row.ticker === ticker);
  const positive = predictions.filter((row) => row.predicted_return > 0).length;
  const negative = predictions.filter((row) => row.predicted_return < 0).length;
  const flat = predictions.length - positive - negative;
  const firstPrediction = predictions[0];

  return (
    <main className="dashboard-shell detail-page">
      <AnimatedSection delay={0}>
        <BackToDashboardButton />
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <Card className="model-hero">
          {dashboard.loading ? (
            <Skeleton height={140} radius="sm" />
          ) : (
            <>
              <Text className="eyebrow">Ticker Detail</Text>
              <Title order={1}>{ticker}</Title>
              <Group mt="md" gap="lg">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Reference close
                  </Text>
                  <Text fw={800}>{formatCurrency(firstPrediction?.reference_close)}</Text>
                </div>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Target date
                  </Text>
                  <Text fw={800}>{formatDate(firstPrediction?.target_date)}</Text>
                </div>
              </Group>
            </>
          )}
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={0.16}>
        <SectionPanel title="Directional Agreement" subtitle="How latest model predictions split for this ticker.">
          <Group gap="xl">
            <Text>
              <strong>{positive}</strong> up
            </Text>
            <Text>
              <strong>{negative}</strong> down
            </Text>
            <Text>
              <strong>{flat}</strong> flat
            </Text>
          </Group>
        </SectionPanel>
      </AnimatedSection>

      <AnimatedSection delay={0.24}>
        <TickerChart
          history={tickerHistory.data}
          predictions={dashboard.latestPredictions}
          selectedTicker={ticker}
          onTickerChange={() => undefined}
          loading={dashboard.loading || tickerHistory.loading}
        />
      </AnimatedSection>
      <AnimatedSection delay={0.32}>
        <PredictionTable rows={predictions} loading={dashboard.loading} />
      </AnimatedSection>
      <AnimatedSection delay={0.4}>
        <DashboardFooter metadata={dashboard.metadata} loading={dashboard.loading} />
      </AnimatedSection>
    </main>
  );
}
