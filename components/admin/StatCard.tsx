type StatCardProps = {
  label: string;
  value: number;
  accent?: "default" | "warning" | "success";
};

const colors: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "text-neutral-900",
  warning: "text-amber-600",
  success: "text-green-600",
};

export default function StatCard({ label, value, accent = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-xs font-medium tracking-wider text-neutral-500 uppercase">{label}</p>
      <p className={`text-2xl font-semibold ${colors[accent]}`}>{value}</p>
    </div>
  );
}
