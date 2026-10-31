import React, { useState, useMemo } from 'react';
import { SalesRecord, formatCurrency, getProductColor, PRODUCT_CATEGORIES, getDayOfWeekName } from '../data/salesData';
import { Sliders, BarChart, TrendingUp, PieChart, LayoutGrid, ArrowDownUp, Download, Eye } from 'lucide-react';

interface CustomVisualizerStudioProps {
  data: SalesRecord[];
}

type DimensionType = 'product' | 'category' | 'paymentMethod' | 'dayOfWeek' | 'week' | 'priceTier';
type MetricType = 'revenue' | 'units' | 'avgPrice' | 'orderCount';
type ChartType = 'vbar' | 'hbar' | 'line' | 'area' | 'donut' | 'treemap';

export const CustomVisualizerStudio: React.FC<CustomVisualizerStudioProps> = ({ data }) => {
  const [dimension, setDimension] = useState<DimensionType>('product');
  const [metric, setMetric] = useState<MetricType>('revenue');
  const [chartType, setChartType] = useState<ChartType>('vbar');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | 'natural'>('desc');
  const [showValues, setShowValues] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group and aggregate data dynamically
  const aggregatedData = useMemo(() => {
    const groupMap = new Map<
      string,
      {
        name: string;
        revenue: number;
        units: number;
        orders: Set<string>;
        prices: number[];
      }
    >();

    const getWeekNumber = (dateStr: string) => {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const start = new Date(2025, 7, 15);
      const diffTime = d.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      return `Week ${Math.floor(diffDays / 7) + 1}`;
    };

    const getPriceTier = (price: number) => {
      if (price < 80) return 'Under $80 (Budget)';
      if (price <= 100) return '$80 - $100 (Core)';
      if (price <= 145) return '$101 - $145 (Premium)';
      return '$150+ (Luxury)';
    };

    data.forEach((item) => {
      let key = '';
      switch (dimension) {
        case 'product':
          key = item.product;
          break;
        case 'category':
          key = PRODUCT_CATEGORIES[item.product] || 'Other';
          break;
        case 'paymentMethod':
          key = item.paymentMethod;
          break;
        case 'dayOfWeek':
          key = getDayOfWeekName(item.date);
          break;
        case 'week':
          key = getWeekNumber(item.date);
          break;
        case 'priceTier':
          key = getPriceTier(item.price);
          break;
      }

      const existing = groupMap.get(key) || {
        name: key,
        revenue: 0,
        units: 0,
        orders: new Set<string>(),
        prices: [],
      };

      existing.revenue += item.price;
      existing.units += 1;
      existing.orders.add(item.orderNumber);
      existing.prices.push(item.price);
      groupMap.set(key, existing);
    });

    const list = Array.from(groupMap.values()).map((g) => ({
      name: g.name,
      revenue: g.revenue,
      units: g.units,
      orderCount: g.orders.size,
      avgPrice: g.units > 0 ? Math.round((g.revenue / g.units) * 100) / 100 : 0,
    }));

    // Sorting
    if (sortOrder === 'desc') {
      list.sort((a, b) => b[metric] - a[metric]);
    } else if (sortOrder === 'asc') {
      list.sort((a, b) => a[metric] - b[metric]);
    } else {
      // natural / alphabetical / chronological
      if (dimension === 'dayOfWeek') {
        const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        list.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
      } else {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    const totalMetricSum = list.reduce((sum, item) => sum + item[metric], 0);

    return list.map((item, idx) => ({
      ...item,
      value: item[metric],
      percentage: totalMetricSum > 0 ? (item[metric] / totalMetricSum) * 100 : 0,
      color: getProductColor(item.name || `Item ${idx}`),
    }));
  }, [data, dimension, metric, sortOrder]);

  const maxVal = Math.max(...aggregatedData.map((d) => d.value), 1);
  const totalMetricSum = aggregatedData.reduce((acc, d) => acc + d.value, 0);

  const formatMetricValue = (val: number) => {
    if (metric === 'revenue') return formatCurrency(val);
    if (metric === 'avgPrice') return formatCurrency(val);
    if (metric === 'units') return `${val} units`;
    if (metric === 'orderCount') return `${val} orders`;
    return `${val}`;
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'revenue':
        return 'Total Revenue ($)';
      case 'units':
        return 'Total Units Sold';
      case 'avgPrice':
        return 'Average Price Per Unit ($)';
      case 'orderCount':
        return 'Number of Unique Orders';
    }
  };

  // Dimensions for Chart Rendering
  const width = 800;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 65, left: 70 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            Custom Visualization Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-tabulate any dimension against any sales metric across 6 specialized chart modes
          </p>
        </div>

        {/* Dimension & Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Dimension */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1">Dimension (X):</span>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as DimensionType)}
              className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-md px-2 py-1 font-medium border-0 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="product">Product (12 styles)</option>
              <option value="category">Category</option>
              <option value="paymentMethod">Payment Method</option>
              <option value="dayOfWeek">Day of the Week</option>
              <option value="week">Calendar Week</option>
              <option value="priceTier">Price Tier</option>
            </select>
          </div>

          {/* Metric */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1">Metric (Y):</span>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as MetricType)}
              className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-md px-2 py-1 font-medium border-0 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="revenue">Total Revenue ($)</option>
              <option value="units">Units Sold</option>
              <option value="avgPrice">Average Unit Price ($)</option>
              <option value="orderCount">Unique Orders</option>
            </select>
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : sortOrder === 'asc' ? 'natural' : 'desc')}
              className="px-2 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white flex items-center gap-1"
              title="Toggle sort order"
            >
              <ArrowDownUp className="w-3 h-3" />
              <span>
                {sortOrder === 'desc' ? 'High → Low' : sortOrder === 'asc' ? 'Low → High' : 'Natural'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Type Picker bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'vbar', label: 'Column Bar', icon: <BarChart className="w-3.5 h-3.5" /> },
              { id: 'hbar', label: 'Horizontal Bar', icon: <BarChart className="w-3.5 h-3.5 rotate-90" /> },
              { id: 'line', label: 'Line Curve', icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { id: 'area', label: 'Filled Area', icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { id: 'donut', label: 'Radial Donut', icon: <PieChart className="w-3.5 h-3.5" /> },
              { id: 'treemap', label: 'Treemap Blocks', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => setChartType(c.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                chartType === c.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowValues(!showValues)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              showValues
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Labels {showValues ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Render Chart Area */}
      <div className="py-6 min-h-[360px] flex flex-col justify-center">
        {chartType === 'vbar' && (
          /* Vertical Column Bar Chart */
          <div className="relative w-full aspect-[21/9] min-h-[300px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
              {/* Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = padding.top + innerHeight * (1 - pct);
                const val = maxVal * pct;
                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono tabular-nums fill-slate-400"
                    >
                      {metric === 'revenue' || metric === 'avgPrice' ? `$${Math.round(val)}` : Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {aggregatedData.map((d, i) => {
                const barWidth = Math.max(16, (innerWidth / aggregatedData.length) * 0.7);
                const barSpacing = innerWidth / aggregatedData.length;
                const x = padding.left + i * barSpacing + (barSpacing - barWidth) / 2;
                const barHeight = (d.value / maxVal) * innerHeight;
                const y = padding.top + innerHeight - barHeight;
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={d.name}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      rx="4"
                      fill={d.color}
                      fillOpacity={isHovered ? 1 : 0.85}
                      stroke={isHovered ? '#FFFFFF' : 'none'}
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                    {showValues && barHeight > 18 && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 6}
                        textAnchor="middle"
                        className="text-[9px] font-mono font-semibold fill-slate-700 dark:fill-slate-300"
                      >
                        {metric === 'revenue' || metric === 'avgPrice' ? `$${Math.round(d.value)}` : d.value}
                      </text>
                    )}
                    {/* X-axis label */}
                    <text
                      x={x + barWidth / 2}
                      y={padding.top + innerHeight + 14}
                      textAnchor="end"
                      transform={`rotate(-35 ${x + barWidth / 2} ${padding.top + innerHeight + 14})`}
                      className="text-[10px] font-medium fill-slate-600 dark:fill-slate-400"
                    >
                      {d.name.length > 16 ? `${d.name.slice(0, 14)}...` : d.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {chartType === 'hbar' && (
          /* Horizontal Ranking Bars */
          <div className="space-y-2.5 max-w-4xl mx-auto w-full">
            {aggregatedData.map((d, idx) => {
              const pct = (d.value / maxVal) * 100;
              return (
                <div
                  key={d.name}
                  className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-sans truncate max-w-[280px]">
                      {idx + 1}. {d.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{d.percentage.toFixed(1)}%</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums w-24 text-right">
                        {formatMetricValue(d.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(chartType === 'line' || chartType === 'area') && (
          /* Line or Area Curve */
          <div className="relative w-full aspect-[21/9] min-h-[300px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
              <defs>
                <linearGradient id="customAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = padding.top + innerHeight * (1 - pct);
                const val = maxVal * pct;
                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono tabular-nums fill-slate-400"
                    >
                      {metric === 'revenue' || metric === 'avgPrice' ? `$${Math.round(val)}` : Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Points calculation */}
              {(() => {
                const pts = aggregatedData.map((d, i) => {
                  const x =
                    padding.left +
                    (i / Math.max(aggregatedData.length - 1, 1)) * innerWidth;
                  const y = padding.top + innerHeight - (d.value / maxVal) * innerHeight;
                  return { x, y, data: d };
                });

                const lineStr = pts
                  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
                  .join(' ');
                const areaStr = `${lineStr} L ${pts[pts.length - 1].x.toFixed(1)},${padding.top + innerHeight} L ${pts[0].x.toFixed(1)},${padding.top + innerHeight} Z`;

                return (
                  <g>
                    {chartType === 'area' && <path d={areaStr} fill="url(#customAreaGrad)" />}
                    <path
                      d={lineStr}
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {pts.map((p, i) => (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={hoveredIndex === i ? 6 : 4}
                          fill="#6366F1"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        {showValues && (
                          <text
                            x={p.x}
                            y={p.y - 8}
                            textAnchor="middle"
                            className="text-[9px] font-mono font-semibold fill-slate-700 dark:fill-slate-300"
                          >
                            {metric === 'revenue' || metric === 'avgPrice' ? `$${Math.round(p.data.value)}` : p.data.value}
                          </text>
                        )}
                        <text
                          x={p.x}
                          y={padding.top + innerHeight + 14}
                          textAnchor="end"
                          transform={`rotate(-35 ${p.x} ${padding.top + innerHeight + 14})`}
                          className="text-[10px] font-medium fill-slate-600 dark:fill-slate-400"
                        >
                          {p.data.name.length > 14 ? `${p.data.name.slice(0, 12)}...` : p.data.name}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        )}

        {chartType === 'donut' && (
          /* Donut / Radial Breakdown */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto w-full">
            <div className="flex justify-center relative">
              {(() => {
                const s = 240;
                const sw = 32;
                const r = (s - sw) / 2;
                const c = s / 2;
                const circ = 2 * Math.PI * r;
                let acc = 0;

                return (
                  <div className="relative w-60 h-60">
                    <svg viewBox={`0 0 ${s} ${s}`} className="w-full h-full -rotate-90 select-none">
                      <circle cx={c} cy={c} r={r} fill="none" stroke="#E2E8F0" strokeWidth={sw} />
                      {aggregatedData.map((d, i) => {
                        const dash = `${(d.percentage / 100) * circ} ${circ}`;
                        const offset = -(acc / 100) * circ;
                        acc += d.percentage;
                        const isHovered = hoveredIndex === i;

                        return (
                          <circle
                            key={d.name}
                            cx={c}
                            cy={c}
                            r={r}
                            fill="none"
                            stroke={d.color}
                            strokeWidth={isHovered ? sw + 4 : sw}
                            strokeDasharray={dash}
                            strokeDashoffset={offset}
                            className="cursor-pointer transition-all duration-200"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {hoveredIndex !== null ? aggregatedData[hoveredIndex]?.name : 'Total'}
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {hoveredIndex !== null
                          ? formatMetricValue(aggregatedData[hoveredIndex]?.value)
                          : formatMetricValue(totalMetricSum)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {aggregatedData.map((d, i) => (
                <div
                  key={d.name}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    hoveredIndex === i ? 'bg-slate-100 dark:bg-slate-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 truncate max-w-[200px]">
                    <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="font-sans font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{d.percentage.toFixed(1)}%</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatMetricValue(d.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartType === 'treemap' && (
          /* Treemap Area Proportional Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-w-5xl mx-auto w-full">
            {aggregatedData.map((d, idx) => (
              <div
                key={d.name}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[90px]"
                style={{
                  backgroundColor: `${d.color}15`,
                  borderColor: `${d.color}50`,
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {d.name}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                    style={{ backgroundColor: d.color }}
                  />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {formatMetricValue(d.value)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {d.percentage.toFixed(1)}% contribution
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Hover Tooltip if active */}
      {hoveredIndex !== null && aggregatedData[hoveredIndex] && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-xs"
              style={{ backgroundColor: aggregatedData[hoveredIndex].color }}
            />
            <strong className="text-slate-900 dark:text-white font-sans">
              {aggregatedData[hoveredIndex].name}
            </strong>
            <span className="text-slate-400">·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {formatMetricValue(aggregatedData[hoveredIndex].value)} ({aggregatedData[hoveredIndex].percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="text-slate-500">
            {aggregatedData[hoveredIndex].units} units · {aggregatedData[hoveredIndex].orderCount} orders · Avg ${aggregatedData[hoveredIndex].avgPrice}
          </div>
        </div>
      )}
    </div>
  );
};
