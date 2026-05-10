const COLORS = {
  Transport: "#3B82F6",
  Stay: "#8B5CF6",
  Activities: "#F5A623",
  Meals: "#10B981",
};

export function PieChart({ data, total }) {
  if (!total || total === 0) return null;
  let cumulative = 0;
  const slices = Object.entries(data).filter(([, v]) => v > 0).map(([key, value]) => {
    const start = cumulative;
    cumulative += (value / total) * 100;
    return { key, value, start, end: cumulative, color: COLORS[key] || "#9CA3AF" };
  });
  if (slices.length === 0) return null;

  const gradient = slices.map((s) =>
    `${s.color} ${s.start.toFixed(1)}% ${s.end.toFixed(1)}%`
  ).join(", ");

  return (
    <div
      className="w-40 h-40 rounded-full shrink-0"
      style={{ background: `conic-gradient(${gradient})` }}
    />
  );
}

export function BarChart({ data, maxValue, labelKey, valueKey, color }) {
  const max = Math.max(1, maxValue || 1);
  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const val = item[valueKey] || 0;
        const pct = (val / max) * 100;
        return (
          <div key={item[labelKey] || i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-secondary font-medium">{item[labelKey]}</span>
              <span className="text-gray-500">${val.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${color || "bg-primary"}`}
                style={{ width: `${Math.max(2, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PieChart;
