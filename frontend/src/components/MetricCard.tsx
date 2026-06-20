type Props = {
  label: string;
  value: string;
};

export default function MetricCard({ label, value }: Props) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
