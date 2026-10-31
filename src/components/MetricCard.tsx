import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  sparklineData?: number[];
  sparklineColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  sparklineData,
  sparklineColor = '#6366F1',
  icon,
}) => {
  // Generate SVG path for sparkline if data is provided
  let sparklinePath = '';
  let sparklineFill = '';
  if (sparklineData && sparklineData.length > 1) {
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 120;
    const height = 36;
    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    sparklinePath = `M ${points.join(' L ')}`;
    sparklineFill = `M ${points[0]} L ${points.join(' L ')} L ${width},${height} L 0,${height} Z`;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            {label}
          </span>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-semibold tabular-nums ${
                  trend.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend.value}
              </span>
              {trend.label && <span>{trend.label}</span>}
            </div>
          ) : (
            subtext && <span>{subtext}</span>
          )}
        </div>

        {sparklinePath && (
          <div className="w-24 h-8 shrink-0">
            <svg viewBox="0 0 120 36" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={sparklineFill} fill={`url(#grad-${label.replace(/\s+/g, '')})`} />
              <path
                d={sparklinePath}
                fill="none"
                stroke={sparklineColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
