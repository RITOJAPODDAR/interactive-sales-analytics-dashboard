import React, { useState, useMemo } from 'react';
import { SalesRecord, formatCurrency, formatDateLabel, getDayOfWeekName } from '../data/salesData';
import { Calendar, Flame, Clock } from 'lucide-react';

interface TemporalHeatmapProps {
  data: SalesRecord[];
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
}

export const TemporalHeatmap: React.FC<TemporalHeatmapProps> = ({
  data,
  onSelectDate,
  selectedDate,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    revenue: number;
    count: number;
    products: string[];
  } | null>(null);

  // Build complete date list from 2025-08-15 to 2025-10-07 (54 calendar days)
  const calendarDays = useMemo(() => {
    const dayMap = new Map<string, { revenue: number; count: number; products: string[] }>();
    data.forEach((item) => {
      const entry = dayMap.get(item.date) || { revenue: 0, count: 0, products: [] };
      entry.revenue += item.price;
      entry.count += 1;
      entry.products.push(item.product);
      dayMap.set(item.date, entry);
    });

    const start = new Date(2025, 7, 15); // Aug 15, 2025
    const end = new Date(2025, 9, 7); // Oct 7, 2025
    const days: Array<{
      dateStr: string;
      date: Date;
      revenue: number;
      count: number;
      products: string[];
      dayOfWeek: number; // 0 Sun - 6 Sat
      dayName: string;
    }> = [];

    const curr = new Date(start);
    while (curr <= end) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const stats = dayMap.get(dateStr) || { revenue: 0, count: 0, products: [] };

      days.push({
        dateStr,
        date: new Date(curr),
        revenue: stats.revenue,
        count: stats.count,
        products: stats.products,
        dayOfWeek: curr.getDay(),
        dayName: curr.toLocaleDateString('en-US', { weekday: 'short' }),
      });

      curr.setDate(curr.getDate() + 1);
    }

    return days;
  }, [data]);

  // Day of week summary
  const dayOfWeekSummary = useMemo(() => {
    const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map = new Map<string, { day: string; revenue: number; count: number }>();
    dow.forEach((d) => map.set(d, { day: d, revenue: 0, count: 0 }));

    data.forEach((item) => {
      const dName = getDayOfWeekName(item.date);
      const existing = map.get(dName);
      if (existing) {
        existing.revenue += item.price;
        existing.count += 1;
      }
    });

    const list = Array.from(map.values());
    const maxRev = Math.max(...list.map((l) => l.revenue), 1);
    return { list, maxRev };
  }, [data]);

  // Max revenue in a single day for heat color scaling
  const maxDayRevenue = Math.max(...calendarDays.map((d) => d.revenue), 100);

  const getHeatColorClass = (revenue: number) => {
    if (revenue === 0) return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60';
    const ratio = revenue / maxDayRevenue;
    if (ratio < 0.25) return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
    if (ratio < 0.5) return 'bg-indigo-300 dark:bg-indigo-800/80 text-indigo-950 dark:text-white border-indigo-400 dark:border-indigo-600';
    if (ratio < 0.75) return 'bg-indigo-500 text-white border-indigo-600 font-semibold';
    return 'bg-indigo-700 dark:bg-indigo-600 text-white border-indigo-800 font-bold shadow-xs';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Temporal Cadence & Calendar Heatmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            54 calendar days tracked (August 15 – October 7, 2025) · Density by daily sales volume
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-300 dark:bg-indigo-800 border border-indigo-400" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-500 border border-indigo-600" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-700 border border-indigo-800" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Heatmap Matrix */}
        <div className="lg:col-span-8">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span>Daily Revenue Heat Intensity</span>
              <span className="font-mono text-slate-400 font-normal">
                Peak Day: {formatCurrency(maxDayRevenue)}
              </span>
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-slate-400 uppercase py-1">
                  {d}
                </div>
              ))}

              {/* Offset for first day (Aug 15, 2025 was Friday = day 5) */}
              {Array.from({ length: calendarDays[0].dayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square opacity-0" />
              ))}

              {calendarDays.map((day) => {
                const isSelected = selectedDate === day.dateStr;
                const heatClass = getHeatColorClass(day.revenue);

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => onSelectDate && onSelectDate(day.dateStr)}
                    onMouseEnter={() =>
                      setHoveredDay({
                        date: day.dateStr,
                        revenue: day.revenue,
                        count: day.count,
                        products: day.products,
                      })
                    }
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`aspect-square rounded-lg border text-center flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${heatClass} ${
                      isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                    } hover:scale-105 hover:z-10`}
                  >
                    <span className="text-[10px] leading-none">{day.date.getDate()}</span>
                    {day.revenue > 0 && (
                      <span className="text-[8px] font-mono tabular-nums leading-tight mt-0.5 opacity-90 hidden sm:block">
                        ${Math.round(day.revenue)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tooltip detail bar */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 min-h-[36px] flex items-center justify-between text-xs font-mono">
              {hoveredDay ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {hoveredDay.date} ({getDayOfWeekName(hoveredDay.date)})
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(hoveredDay.revenue)}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {hoveredDay.count} items sold
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {hoveredDay.products.join(', ')}
                  </span>
                </>
              ) : (
                <span className="text-slate-400 italic">
                  Hover over any date cell to inspect exact transaction breakdown
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Day of Week Breakdown */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 h-full">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Day of Week Velocity
            </div>

            <div className="space-y-3">
              {dayOfWeekSummary.list.map((dow) => {
                const pct = (dow.revenue / dayOfWeekSummary.maxRev) * 100;
                return (
                  <div key={dow.day} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-8">
                        {dow.day}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {dow.count} items
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(dow.revenue)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Weekend volume accounts for{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {Math.round(
                  ((dayOfWeekSummary.list.find((d) => d.day === 'Sat')?.revenue || 0) +
                    (dayOfWeekSummary.list.find((d) => d.day === 'Sun')?.revenue || 0)) /
                    (data.reduce((a, b) => a + b.price, 0) || 1) *
                    100
                )}
                %
              </strong>{' '}
              of total store sales.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
