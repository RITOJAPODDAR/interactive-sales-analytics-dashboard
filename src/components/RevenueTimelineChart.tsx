import React, { useState, useMemo } from 'react';
import { SalesRecord, formatCurrency, formatDateLabel, getDayOfWeekName } from '../data/salesData';
import { TrendingUp, BarChart2, Activity, Layers } from 'lucide-react';

interface RevenueTimelineChartProps {
  data: SalesRecord[];
}

export const RevenueTimelineChart: React.FC<RevenueTimelineChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'cumulative' | 'ma7' | 'volume'>('daily');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group by date
  const timelineData = useMemo(() => {
    // Generate chronological map
    const dayMap = new Map<string, { date: string; revenue: number; count: number; items: SalesRecord[] }>();

    data.forEach((item) => {
      const existing = dayMap.get(item.date) || { date: item.date, revenue: 0, count: 0, items: [] };
      existing.revenue += item.price;
      existing.count += 1;
      existing.items.push(item);
      dayMap.set(item.date, existing);
    });

    const sorted = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate cumulative and 7-day moving average
    let runningTotal = 0;
    return sorted.map((day, idx, arr) => {
      runningTotal += day.revenue;

      // 7-day MA window
      const startIdx = Math.max(0, idx - 6);
      const windowSlice = arr.slice(startIdx, idx + 1);
      const sum = windowSlice.reduce((acc, curr) => acc + curr.revenue, 0);
      const ma7 = sum / windowSlice.length;

      return {
        ...day,
        cumulative: runningTotal,
        ma7: Math.round(ma7 * 100) / 100,
      };
    });
  }, [data]);

  if (timelineData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
        No sales records match the selected criteria.
      </div>
    );
  }

  // Chart dimensions & scaling
  const width = 800;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Values based on viewMode
  const values = timelineData.map((d) => {
    if (viewMode === 'cumulative') return d.cumulative;
    if (viewMode === 'ma7') return d.ma7;
    if (viewMode === 'volume') return d.count;
    return d.revenue;
  });

  const maxValue = Math.max(...values, 10);
  const minValue = 0;
  const range = maxValue - minValue;

  const points = timelineData.map((d, i) => {
    const val =
      viewMode === 'cumulative'
        ? d.cumulative
        : viewMode === 'ma7'
        ? d.ma7
        : viewMode === 'volume'
        ? d.count
        : d.revenue;
    const x = padding.left + (i / Math.max(timelineData.length - 1, 1)) * innerWidth;
    const y = padding.top + innerHeight - (val / range) * innerHeight;
    return { x, y, value: val, data: d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)},${padding.top + innerHeight} L ${points[0].x.toFixed(1)},${padding.top + innerHeight} Z`;

  // Average line
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const avgY = padding.top + innerHeight - (avgValue / range) * innerHeight;

  // Selected or hovered point
  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Revenue Velocity & Daily Trajectory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {timelineData.length} active sales days · Daily velocity average:{' '}
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(data.reduce((acc, d) => acc + d.price, 0) / timelineData.length)}/day
            </span>
          </p>
        </div>

        {/* View mode toggle button pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'daily'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('ma7')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'ma7'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7-Day MA
          </button>
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'cumulative'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cumulative
          </button>
          <button
            onClick={() => setViewMode('volume')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'volume'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Volume (Units)
          </button>
        </div>
      </div>

      {/* SVG Timeline Canvas */}
      <div className="relative w-full aspect-[21/8] min-h-[260px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="maGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + innerHeight * (1 - pct);
            const val = minValue + range * pct;
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeDasharray={pct === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono tabular-nums fill-slate-400 dark:fill-slate-500"
                >
                  {viewMode === 'volume' ? Math.round(val) : `$${Math.round(val)}`}
                </text>
              </g>
            );
          })}

          {/* Average Reference Line */}
          <line
            x1={padding.left}
            y1={avgY}
            x2={padding.left + innerWidth}
            y2={avgY}
            stroke="#94A3B8"
            strokeDasharray="4 4"
            strokeWidth="1.2"
          />
          <text
            x={padding.left + innerWidth - 6}
            y={avgY - 6}
            textAnchor="end"
            className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500 font-semibold"
          >
            Avg: {viewMode === 'volume' ? `${avgValue.toFixed(1)} units` : `$${Math.round(avgValue)}`}
          </text>

          {/* Area Fill */}
          <path
            d={areaPath}
            fill={viewMode === 'ma7' ? 'url(#maGradient)' : 'url(#revenueGradient)'}
          />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke={viewMode === 'ma7' ? '#10B981' : '#6366F1'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis Date Labels */}
          {points.map((p, i) => {
            // Show every ~5th label to prevent crowding
            const step = Math.ceil(points.length / 8);
            const isLabel = i % step === 0 || i === points.length - 1;
            if (!isLabel) return null;
            return (
              <g key={i}>
                <line
                  x1={p.x}
                  y1={padding.top + innerHeight}
                  x2={p.x}
                  y2={padding.top + innerHeight + 4}
                  stroke="currentColor"
                  className="text-slate-300 dark:text-slate-700"
                />
                <text
                  x={p.x}
                  y={padding.top + innerHeight + 18}
                  textAnchor="middle"
                  className="text-[10px] font-mono tabular-nums fill-slate-400 dark:fill-slate-500"
                >
                  {formatDateLabel(p.data.date)}
                </text>
              </g>
            );
          })}

          {/* Invisible hover capture slices */}
          {points.map((p, i) => {
            const sliceWidth = innerWidth / points.length;
            return (
              <rect
                key={i}
                x={p.x - sliceWidth / 2}
                y={padding.top}
                width={sliceWidth}
                height={innerHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              />
            );
          })}

          {/* Hover highlight crosshair & point */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={padding.top + innerHeight}
                stroke="#6366F1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill="#6366F1"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="shadow-md"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Card */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 dark:bg-slate-800/95 text-white p-3 rounded-lg shadow-xl backdrop-blur-xs border border-slate-700 text-xs min-w-[180px] transform -translate-x-1/2 -translate-y-full transition-all"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${Math.max(10, (activePoint.y / height) * 100 - 4)}%`,
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-700/80 pb-1 mb-1.5 flex items-center justify-between">
              <span>{activePoint.data.date}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {getDayOfWeekName(activePoint.data.date)}
              </span>
            </div>
            <div className="space-y-1 tabular-nums font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Day Revenue:</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(activePoint.data.revenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Units Sold:</span>
                <span className="font-semibold text-slate-200">
                  {activePoint.data.count} items
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cumulative:</span>
                <span className="font-semibold text-indigo-300">
                  {formatCurrency(activePoint.data.cumulative)}
                </span>
              </div>
            </div>
            {activePoint.data.items.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-slate-700/80 text-[10px] text-slate-300 truncate">
                Items: {activePoint.data.items.map((i) => i.product).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
