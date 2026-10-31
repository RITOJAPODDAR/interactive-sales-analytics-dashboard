import React, { useState, useMemo } from 'react';
import { SalesRecord, formatCurrency, getProductColor, PRODUCT_CATEGORIES } from '../data/salesData';
import { BarChart3, ScatterChart as ScatterIcon, ArrowUpDown, Percent } from 'lucide-react';

interface ProductPerformanceChartProps {
  data: SalesRecord[];
  onSelectProduct?: (productName: string) => void;
  selectedProduct?: string;
}

export const ProductPerformanceChart: React.FC<ProductPerformanceChartProps> = ({
  data,
  onSelectProduct,
  selectedProduct,
}) => {
  const [metricMode, setMetricMode] = useState<'revenue' | 'units' | 'price' | 'pareto'>('revenue');
  const [viewType, setViewType] = useState<'bar' | 'scatter'>('bar');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Aggregate by product
  const productStats = useMemo(() => {
    const map = new Map<
      string,
      {
        product: string;
        revenue: number;
        units: number;
        unitPrice: number;
        category: string;
        paymentMethods: Record<string, number>;
      }
    >();

    data.forEach((item) => {
      const existing = map.get(item.product) || {
        product: item.product,
        revenue: 0,
        units: 0,
        unitPrice: item.price,
        category: PRODUCT_CATEGORIES[item.product] || 'Apparel',
        paymentMethods: {},
      };
      existing.revenue += item.price;
      existing.units += 1;
      existing.paymentMethods[item.paymentMethod] = (existing.paymentMethods[item.paymentMethod] || 0) + 1;
      map.set(item.product, existing);
    });

    const list = Array.from(map.values());
    const totalRevenue = list.reduce((sum, p) => sum + p.revenue, 0);

    // Sort according to metric
    if (metricMode === 'units') {
      list.sort((a, b) => b.units - a.units);
    } else if (metricMode === 'price') {
      list.sort((a, b) => b.unitPrice - a.unitPrice);
    } else {
      // revenue or pareto
      list.sort((a, b) => b.revenue - a.revenue);
    }

    // Compute cumulative percentages for Pareto
    let cumSum = 0;
    return list.map((item) => {
      cumSum += item.revenue;
      return {
        ...item,
        pctOfTotal: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
        cumulativePct: totalRevenue > 0 ? (cumSum / totalRevenue) * 100 : 0,
      };
    });
  }, [data, metricMode]);

  const maxRevenue = Math.max(...productStats.map((p) => p.revenue), 100);
  const maxUnits = Math.max(...productStats.map((p) => p.units), 5);
  const maxPrice = Math.max(...productStats.map((p) => p.unitPrice), 50);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      {/* Header with visual toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Product Portfolio & Yield Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any row to filter dashboard · {productStats.length} catalog items represented
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Scatter vs Bar toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewType('bar')}
              title="Bar ranking view"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ranking Bars
            </button>
            <button
              onClick={() => setViewType('scatter')}
              title="Price vs Volume quadrant matrix"
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewType === 'scatter'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Price-Volume Matrix
            </button>
          </div>

          {/* Metric Sort toggle */}
          {viewType === 'bar' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setMetricMode('revenue')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  metricMode === 'revenue'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setMetricMode('units')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  metricMode === 'units'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Units
              </button>
              <button
                onClick={() => setMetricMode('price')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  metricMode === 'price'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setMetricMode('pareto')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  metricMode === 'pareto'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Pareto (80/20)
              </button>
            </div>
          )}
        </div>
      </div>

      {viewType === 'bar' ? (
        /* Horizontal Performance Bars */
        <div className="space-y-2.5">
          {productStats.map((item, idx) => {
            const isSelected = selectedProduct === item.product;
            const isHovered = hoveredProduct === item.product;
            const barPct =
              metricMode === 'units'
                ? (item.units / maxUnits) * 100
                : metricMode === 'price'
                ? (item.unitPrice / maxPrice) * 100
                : (item.revenue / maxRevenue) * 100;

            const color = getProductColor(item.product);

            return (
              <div
                key={item.product}
                onClick={() => onSelectProduct && onSelectProduct(item.product)}
                onMouseEnter={() => setHoveredProduct(item.product)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`group p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs'
                    : isHovered
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700'
                    : 'bg-transparent border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono tabular-nums text-slate-400 w-5 text-right font-medium">
                      {idx + 1}.
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.product}
                    </span>
                    <span className="hidden md:inline text-slate-400 dark:text-slate-500 font-normal">
                      · {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono tabular-nums text-right">
                    <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                      {formatCurrency(item.unitPrice)}/ea
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 w-16">
                      {item.units} units
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white w-20">
                      {formatCurrency(item.revenue)}
                    </span>
                    {metricMode === 'pareto' && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-14">
                        {item.cumulativePct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barPct}%`,
                      backgroundColor: color,
                    }}
                  />
                  {metricMode === 'pareto' && (
                    <div
                      className="h-full border-r-2 border-indigo-500"
                      style={{ width: `${Math.max(0, item.cumulativePct - barPct)}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Scatter / Bubble Quadrant Matrix (Price vs Volume) */
        <div className="relative w-full aspect-[21/10] min-h-[300px] border border-slate-100 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <svg viewBox="0 0 650 320" className="w-full h-full overflow-visible select-none">
            {/* Quadrant Divider lines */}
            <line
              x1="325"
              y1="30"
              x2="325"
              y2="280"
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="155"
              x2="600"
              y2="155"
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* Quadrant labels */}
            <text x="60" y="50" className="text-[10px] fill-slate-400 dark:fill-slate-500 font-semibold uppercase tracking-wider">
              High Volume / Value Driver
            </text>
            <text x="590" y="50" textAnchor="end" className="text-[10px] fill-indigo-500 font-semibold uppercase tracking-wider">
              Premium Star (High Price + Vol)
            </text>
            <text x="60" y="270" className="text-[10px] fill-slate-400 dark:fill-slate-500 font-semibold uppercase tracking-wider">
              Entry / Lower Volume
            </text>
            <text x="590" y="270" textAnchor="end" className="text-[10px] fill-slate-400 dark:fill-slate-500 font-semibold uppercase tracking-wider">
              Niche Luxury (High Price)
            </text>

            {/* Axes & labels */}
            <line x1="50" y1="280" x2="600" y2="280" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="50" y1="30" x2="50" y2="280" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="325" y="305" textAnchor="middle" className="text-[11px] fill-slate-500 dark:fill-slate-400 font-medium">
              Unit Price ($58 → $175)
            </text>
            <text x="25" y="155" textAnchor="middle" transform="rotate(-90 25 155)" className="text-[11px] fill-slate-500 dark:fill-slate-400 font-medium">
              Units Sold (8 → 13)
            </text>

            {/* Bubbles */}
            {productStats.map((item) => {
              // Normalize Price to X (min 50, max 180)
              const cx = 50 + ((item.unitPrice - 50) / (180 - 50)) * 550;
              // Normalize Units to Y (min 6, max 14)
              const cy = 280 - ((item.units - 6) / (14 - 6)) * 240;
              // Radius by Revenue ($580 -> $1575) -> 7 to 20
              const r = 7 + ((item.revenue - 580) / (1575 - 580)) * 14;

              const isHovered = hoveredProduct === item.product;
              const color = getProductColor(item.product);

              return (
                <g
                  key={item.product}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredProduct(item.product)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => onSelectProduct && onSelectProduct(item.product)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? r + 3 : r}
                    fill={color}
                    fillOpacity={isHovered ? 0.9 : 0.75}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-150 shadow-sm"
                  />
                  <text
                    x={cx}
                    y={cy - r - 4}
                    textAnchor="middle"
                    className="text-[9px] font-semibold fill-slate-700 dark:fill-slate-300 pointer-events-none"
                  >
                    {item.product.split(' ')[0]} (${item.unitPrice})
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover detail tooltip */}
          {hoveredProduct && (
            <div className="absolute top-2 right-2 bg-slate-900/90 text-white p-2.5 rounded-lg text-xs font-mono shadow-lg border border-slate-700">
              {(() => {
                const prod = productStats.find((p) => p.product === hoveredProduct);
                if (!prod) return null;
                return (
                  <div>
                    <div className="font-bold text-white mb-1 font-sans">{prod.product}</div>
                    <div className="text-slate-300">Unit Price: {formatCurrency(prod.unitPrice)}</div>
                    <div className="text-slate-300">Total Units: {prod.units} sold</div>
                    <div className="text-emerald-400 font-bold">Total Rev: {formatCurrency(prod.revenue)}</div>
                    <div className="text-indigo-300 text-[10px] mt-0.5">{prod.pctOfTotal.toFixed(1)}% of catalog revenue</div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
