import { memo } from "react";

type TrendSparklineProps = {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  showFill?: boolean;
};

export const TrendSparkline = memo(function TrendSparkline({
  values,
  color = "#86efac",
  width = 180,
  height = 50,
  showFill = true,
}: TrendSparklineProps) {
  if (!values.length) {
    return <div className="h-[1px] w-full rounded-full bg-white/10" />;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const normalize = (v: number) => height - ((v - min) / range) * height;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const path = values.reduce((acc, value, idx) => {
    const x = idx * step;
    const y = normalize(value);

    if (idx === 0) {
      return `M ${x},${y}`;
    }

    const prevX = (idx - 1) * step;
    const prevY = normalize(values[idx - 1]);
    const midX = (prevX + x) / 2;

    return `${acc} Q ${prevX},${prevY} ${midX},${(prevY + y) / 2} T ${x},${y}`;
  }, "");

  const area = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {showFill && (
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {showFill && <path d={area} fill="url(#spark-fill)" opacity="0.35" />}
      <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
});
