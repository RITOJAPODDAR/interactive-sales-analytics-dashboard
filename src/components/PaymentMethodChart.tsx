import React, { useState, useMemo } from 'react';
import { SalesRecord, formatCurrency, ALL_PAYMENT_METHODS, PAYMENT_METHOD_COLORS, getDayOfWeekName } from '../data/salesData';
import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';

interface PaymentMethodChartProps {
  data: SalesRecord[];
  onSelectPaymentMethod?: (method: string) => void;
  selectedPaymentMethod?: string;
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  data,
  onSelectPaymentMethod,
  selectedPaymentMethod,
}) => {
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  // Group by payment method
  const stats = useMemo(() => {
    const map = new Map<
      string,
      {
        method: string;
        revenue: number;
        count: number;
        uniqueOrders: Set<string>;
        weekendCount: number;
        weekdayCount: number;
      }
    >();

    ALL_PAYMENT_METHODS.forEach((pm) => {
      map.set(pm, {
        method: pm,
        revenue: 0,
        count: 0,
        uniqueOrders: new Set(),
        weekendCount: 0,
        weekdayCount: 0,
      });
    });

    data.forEach((item) => {
      const existing = map.get(item.paymentMethod) || {
        method: item.paymentMethod,
        revenue: 0,
        count: 0,
        uniqueOrders: new Set(),
        weekendCount: 0,
        weekdayCount: 0,
      };
      existing.revenue += item.price;
      existing.count += 1;
      existing.uniqueOrders.add(item.orderNumber);

      const dayName = getDayOfWeekName(item.date);
      if (dayName === 'Sat' || dayName === 'Sun') {
        existing.weekendCount += 1;
      } else {
        existing.weekdayCount += 1;
      }
      map.set(item.paymentMethod, existing);
    });

    const list = Array.from(map.values());
    const totalRev = list.reduce((sum, s) => sum + s.revenue, 0);
    const totalCount = list.reduce((sum, s) => sum + s.count, 0);

    return list.map((item) => ({
      ...item,
      orderCount: item.uniqueOrders.size,
      revenueShare: totalRev > 0 ? (item.revenue / totalRev) * 100 : 0,
      countShare: totalCount > 0 ? (item.count / totalCount) * 100 : 0,
      avgItemPrice: item.count > 0 ? item.revenue / item.count : 0,
      avgOrderValue: item.uniqueOrders.size > 0 ? item.revenue / item.uniqueOrders.size : 0,
    }));
  }, [data]);

  const totalRevenue = stats.reduce((sum, s) => sum + s.revenue, 0);

  // Donut chart geometry
  const size = 260;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = stats.map((item) => {
    const strokeDasharray = `${(item.revenueShare / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercent / 100) * circumference;
    accumulatedPercent += item.revenueShare;

    const colors = PAYMENT_METHOD_COLORS[item.method] || {
      fill: '#6366F1',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
    };

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: colors.fill,
      colors,
    };
  });

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCard className="w-4 h-4" />;
      case 'Debit Card':
        return <ShieldCheck className="w-4 h-4" />;
      case 'eWallet':
        return <Wallet className="w-4 h-4" />;
      case 'Cash':
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const highlightedItem = stats.find((s) => s.method === (activeSlice || selectedPaymentMethod)) || null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            Payment Channel & Settlement Mix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Share of revenue, transaction velocity, and average checkout ticket size
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Donut Chart SVG */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90 select-none">
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth={strokeWidth}
              />
              {slices.map((slice) => {
                const isSelected = selectedPaymentMethod === slice.method;
                const isHovered = activeSlice === slice.method;
                return (
                  <circle
                    key={slice.method}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={isHovered || isSelected ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    onMouseEnter={() => setActiveSlice(slice.method)}
                    onMouseLeave={() => setActiveSlice(null)}
                    onClick={() => onSelectPaymentMethod && onSelectPaymentMethod(slice.method)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {highlightedItem ? highlightedItem.method : 'Total Revenue'}
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {highlightedItem
                  ? formatCurrency(highlightedItem.revenue)
                  : formatCurrency(totalRevenue)}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {highlightedItem
                  ? `${highlightedItem.revenueShare.toFixed(1)}% share · ${highlightedItem.count} items`
                  : `${data.length} total items`}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Cards & Channel Metrics */}
        <div className="lg:col-span-7 space-y-3">
          {slices.map((item) => {
            const isSelected = selectedPaymentMethod === item.method;
            const isHovered = activeSlice === item.method;

            return (
              <div
                key={item.method}
                onClick={() => onSelectPaymentMethod && onSelectPaymentMethod(item.method)}
                onMouseEnter={() => setActiveSlice(item.method)}
                onMouseLeave={() => setActiveSlice(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                    : isHovered
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {getMethodIcon(item.method)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.method}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 font-mono tabular-nums">
                        {item.count} items ({item.countShare.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono tabular-nums">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block font-mono tabular-nums">
                      {item.revenueShare.toFixed(1)}% of total
                    </span>
                  </div>
                </div>

                {/* Sub metrics: AOV, Weekend vs Weekday */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block">Avg/Item</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.avgItemPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Unique Orders</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.orderCount} orders
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Weekday / Wknd</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.weekdayCount} / {item.weekendCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
