import React, { useMemo } from 'react';
import { SalesRecord, formatCurrency, getProductColor } from '../data/salesData';
import { ShoppingBag, Sparkles, Layers, Link2 } from 'lucide-react';

interface BasketAnalysisChartProps {
  data: SalesRecord[];
}

export const BasketAnalysisChart: React.FC<BasketAnalysisChartProps> = ({ data }) => {
  // Group items by orderNumber
  const orders = useMemo(() => {
    const orderMap = new Map<
      string,
      {
        orderNumber: string;
        date: string;
        paymentMethod: string;
        items: SalesRecord[];
        totalPrice: number;
      }
    >();

    data.forEach((item) => {
      const existing = orderMap.get(item.orderNumber) || {
        orderNumber: item.orderNumber,
        date: item.date,
        paymentMethod: item.paymentMethod,
        items: [],
        totalPrice: 0,
      };
      existing.items.push(item);
      existing.totalPrice += item.price;
      orderMap.set(item.orderNumber, existing);
    });

    return Array.from(orderMap.values());
  }, [data]);

  // Basket size distribution
  const basketSizeDistribution = useMemo(() => {
    let singleItemCount = 0;
    let singleItemRevenue = 0;
    let multiItemCount = 0;
    let multiItemRevenue = 0;

    orders.forEach((ord) => {
      if (ord.items.length === 1) {
        singleItemCount += 1;
        singleItemRevenue += ord.totalPrice;
      } else {
        multiItemCount += 1;
        multiItemRevenue += ord.totalPrice;
      }
    });

    const totalOrders = orders.length || 1;
    const totalRev = singleItemRevenue + multiItemRevenue || 1;

    return {
      single: {
        count: singleItemCount,
        revenue: singleItemRevenue,
        orderShare: (singleItemCount / totalOrders) * 100,
        revShare: (singleItemRevenue / totalRev) * 100,
        avgTicket: singleItemCount > 0 ? singleItemRevenue / singleItemCount : 0,
      },
      multi: {
        count: multiItemCount,
        revenue: multiItemRevenue,
        orderShare: (multiItemCount / totalOrders) * 100,
        revShare: (multiItemRevenue / totalRev) * 100,
        avgTicket: multiItemCount > 0 ? multiItemRevenue / multiItemCount : 0,
      },
    };
  }, [orders]);

  // Co-purchase affinity (which items appeared in the same order)
  const coPurchases = useMemo(() => {
    const pairMap = new Map<string, { productA: string; productB: string; count: number; orders: string[] }>();

    orders.forEach((ord) => {
      if (ord.items.length > 1) {
        for (let i = 0; i < ord.items.length; i++) {
          for (let j = i + 1; j < ord.items.length; j++) {
            const p1 = ord.items[i].product;
            const p2 = ord.items[j].product;
            const key = [p1, p2].sort().join(' & ');
            const [productA, productB] = [p1, p2].sort();

            const existing = pairMap.get(key) || { productA, productB, count: 0, orders: [] };
            existing.count += 1;
            existing.orders.push(ord.orderNumber);
            pairMap.set(key, existing);
          }
        }
      }
    });

    return Array.from(pairMap.values()).sort((a, b) => b.count - a.count);
  }, [orders]);

  // Order value tier bins
  const orderValueTiers = useMemo(() => {
    const tiers = [
      { label: '< $80 (Low ticket)', min: 0, max: 80, count: 0, rev: 0 },
      { label: '$80 - $120 (Standard single item)', min: 80, max: 120, count: 0, rev: 0 },
      { label: '$120 - $180 (Premium single or mid bundle)', min: 120, max: 180, count: 0, rev: 0 },
      { label: '$180+ (High-value bundles & luxury)', min: 180, max: 9999, count: 0, rev: 0 },
    ];

    orders.forEach((ord) => {
      const match = tiers.find((t) => ord.totalPrice >= t.min && ord.totalPrice < t.max);
      if (match) {
        match.count += 1;
        match.rev += ord.totalPrice;
      }
    });

    return tiers;
  }, [orders]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            Basket Size & Co-Purchase Affinity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-product attachment rates and multi-item checkout behavior across {orders.length} orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Basket Size Comparison Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Single vs Multi-Item Checkouts
            </h3>

            <div className="space-y-3">
              {/* Single item */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Single-Item Orders (1 unit)
                  </span>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatCurrency(basketSizeDistribution.single.revenue)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mb-2">
                  {basketSizeDistribution.single.count} orders ({basketSizeDistribution.single.orderShare.toFixed(1)}% of orders) · Avg {formatCurrency(basketSizeDistribution.single.avgTicket)}
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                    style={{ width: `${basketSizeDistribution.single.revShare}%` }}
                  />
                </div>
              </div>

              {/* Multi item */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Multi-Item Bundles (2 units)
                  </span>
                  <span className="font-mono tabular-nums font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(basketSizeDistribution.multi.revenue)}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 font-mono mb-2">
                  {basketSizeDistribution.multi.count} orders ({basketSizeDistribution.multi.orderShare.toFixed(1)}% of orders) · Avg {formatCurrency(basketSizeDistribution.multi.avgTicket)} (+{Math.round(((basketSizeDistribution.multi.avgTicket - basketSizeDistribution.single.avgTicket) / (basketSizeDistribution.single.avgTicket || 1)) * 100)}% lift)
                </div>
                <div className="w-full h-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${basketSizeDistribution.multi.revShare}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Value Tiers */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Order Value Tier Breakdown
            </h3>
            <div className="space-y-2.5">
              {orderValueTiers.map((tier) => (
                <div key={tier.label} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                      {tier.label}
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                      {tier.count} orders ({formatCurrency(tier.rev)})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(tier.count / orders.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Co-Purchase Affinity List */}
        <div className="lg:col-span-7">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                Frequently Bundled Product Combinations
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {coPurchases.length} distinct pairings
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {coPurchases.map((pair, idx) => {
                const colorA = getProductColor(pair.productA);
                const colorB = getProductColor(pair.productB);

                return (
                  <div
                    key={`${pair.productA}-${pair.productB}`}
                    className="p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                          <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: colorA }} />
                          {pair.productA}
                        </span>
                        <span className="text-slate-400 font-mono">+</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                          <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: colorB }} />
                          {pair.productB}
                        </span>
                      </div>

                      <div className="shrink-0 text-right font-mono">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {pair.count}x bundled
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Order references: {pair.orders.join(', ')}</span>
                      <span>High cross-sell index</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
