import React, { useState, useMemo, useEffect } from 'react';
import {
  SalesRecord,
  INITIAL_SALES_DATA,
  formatCurrency,
  ALL_PRODUCTS,
  ALL_PAYMENT_METHODS,
  PAYMENT_METHOD_COLORS,
} from './data/salesData';
import { TopBar } from './components/TopBar';
import { FilterToolbar, FilterState } from './components/FilterToolbar';
import { MetricCard } from './components/MetricCard';
import { RevenueTimelineChart } from './components/RevenueTimelineChart';
import { ProductPerformanceChart } from './components/ProductPerformanceChart';
import { PaymentMethodChart } from './components/PaymentMethodChart';
import { TemporalHeatmap } from './components/TemporalHeatmap';
import { BasketAnalysisChart } from './components/BasketAnalysisChart';
import { CustomVisualizerStudio } from './components/CustomVisualizerStudio';
import { DataTableExplorer } from './components/DataTableExplorer';
import { TransactionModal } from './components/TransactionModal';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Tag,
  CreditCard,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('retailpulse_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('retailpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('retailpulse_theme', 'light');
    }
  }, [darkMode]);

  // Sales records state (with localStorage caching)
  const [salesData, setSalesData] = useState<SalesRecord[]>(() => {
    const saved = localStorage.getItem('retailpulse_sales_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cached sales data', e);
      }
    }
    return INITIAL_SALES_DATA;
  });

  const isCustomized = salesData.length !== INITIAL_SALES_DATA.length ||
    JSON.stringify(salesData) !== JSON.stringify(INITIAL_SALES_DATA);

  const saveSalesData = (data: SalesRecord[]) => {
    setSalesData(data);
    localStorage.setItem('retailpulse_sales_data', JSON.stringify(data));
  };

  const handleResetData = () => {
    setSalesData(INITIAL_SALES_DATA);
    localStorage.removeItem('retailpulse_sales_data');
  };

  // Active view tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    paymentMethod: 'all',
    selectedProduct: 'all',
    dateRangePreset: 'all',
    startDate: '2025-08-15',
    endDate: '2025-10-07',
    minPrice: 50,
    maxPrice: 180,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return salesData.filter((item) => {
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchOrder = item.orderNumber.toLowerCase().includes(query);
        const matchProduct = item.product.toLowerCase().includes(query);
        if (!matchOrder && !matchProduct) return false;
      }

      // Payment method
      if (filters.paymentMethod !== 'all' && item.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Product
      if (filters.selectedProduct !== 'all' && item.product !== filters.selectedProduct) {
        return false;
      }

      // Date Range
      if (item.date < filters.startDate || item.date > filters.endDate) {
        return false;
      }

      // Price Range
      if (item.price < filters.minPrice || item.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [salesData, filters]);

  // Aggregate high-level KPIs
  const kpis = useMemo(() => {
    const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.price, 0);
    const totalUnits = filteredData.length;
    const uniqueOrders = new Set(filteredData.map((d) => d.orderNumber));
    const avgOrderValue = uniqueOrders.size > 0 ? totalRevenue / uniqueOrders.size : 0;
    const avgUnitPrice = totalUnits > 0 ? totalRevenue / totalUnits : 0;

    // Daily revenue sparkline
    const dayMap = new Map<string, number>();
    filteredData.forEach((d) => {
      dayMap.set(d.date, (dayMap.get(d.date) || 0) + d.price);
    });
    const sortedDates = Array.from(dayMap.keys()).sort();
    const dailySparkline = sortedDates.map((date) => dayMap.get(date) || 0);

    // Top product
    const prodMap = new Map<string, { count: number; rev: number }>();
    filteredData.forEach((d) => {
      const e = prodMap.get(d.product) || { count: 0, rev: 0 };
      e.count += 1;
      e.rev += d.price;
      prodMap.set(d.product, e);
    });
    let topProductByRev = { name: '—', rev: 0, count: 0 };
    prodMap.forEach((val, name) => {
      if (val.rev > topProductByRev.rev) {
        topProductByRev = { name, rev: val.rev, count: val.count };
      }
    });

    // Top payment method
    const pmMap = new Map<string, number>();
    filteredData.forEach((d) => {
      pmMap.set(d.paymentMethod, (pmMap.get(d.paymentMethod) || 0) + d.price);
    });
    let topPm = { name: '—', rev: 0 };
    pmMap.forEach((rev, name) => {
      if (rev > topPm.rev) {
        topPm = { name, rev };
      }
    });

    return {
      totalRevenue,
      totalUnits,
      orderCount: uniqueOrders.size,
      avgOrderValue,
      avgUnitPrice,
      dailySparkline,
      topProductByRev,
      topPm,
    };
  }, [filteredData]);

  // Transaction mutation handlers
  const handleSaveRecord = (record: Partial<SalesRecord>) => {
    if (editingRecord) {
      const updated = salesData.map((d) => (d.id === editingRecord.id ? ({ ...d, ...record } as SalesRecord) : d));
      saveSalesData(updated);
      setEditingRecord(null);
    } else {
      const newRec: SalesRecord = {
        id: `rec-${Date.now()}`,
        orderNumber: record.orderNumber || 'TT-1100',
        product: record.product || ALL_PRODUCTS[0],
        price: record.price || 88.0,
        date: record.date || '2025-10-08',
        paymentMethod: record.paymentMethod || 'Credit Card',
      };
      saveSalesData([...salesData, newRec]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    saveSalesData(salesData.filter((d) => d.id !== id));
  };

  const handleExportCsv = () => {
    const headers = ['Order Number', 'Product', 'Price', 'Date', 'Payment Method'];
    const rows = filteredData.map((r) => [
      r.orderNumber,
      `"${r.product}"`,
      r.price.toFixed(2),
      r.date,
      r.paymentMethod,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `retailpulse_sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Contract compliant header */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => {
          setEditingRecord(null);
          setIsModalOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
        isCustomized={isCustomized}
        totalRecords={salesData.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Global Filter Bar */}
        <FilterToolbar
          filters={filters}
          onChangeFilters={setFilters}
          totalCount={salesData.length}
          filteredCount={filteredData.length}
        />

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            trend={{
              value: `${formatCurrency(kpis.totalRevenue / Math.max(kpis.dailySparkline.length, 1))}`,
              isPositive: true,
              label: 'avg/day',
            }}
            sparklineData={kpis.dailySparkline}
            sparklineColor="#6366F1"
            icon={<DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          />

          <MetricCard
            label="Unique Orders"
            value={`${kpis.orderCount}`}
            subtext={`${kpis.totalUnits} line items sold · ${(kpis.totalUnits / Math.max(kpis.orderCount, 1)).toFixed(2)} items/order`}
            sparklineData={kpis.dailySparkline}
            sparklineColor="#10B981"
            icon={<ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          />

          <MetricCard
            label="Average Order Value (AOV)"
            value={formatCurrency(kpis.avgOrderValue)}
            subtext={`Avg unit retail price: ${formatCurrency(kpis.avgUnitPrice)}`}
            sparklineData={kpis.dailySparkline}
            sparklineColor="#F59E0B"
            icon={<Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          />

          <MetricCard
            label="Top Product Revenue"
            value={formatCurrency(kpis.topProductByRev.rev)}
            subtext={`${kpis.topProductByRev.name} (${kpis.topProductByRev.count} units)`}
            sparklineColor="#EC4899"
            icon={<Award className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
          />
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Primary Timeline */}
            <RevenueTimelineChart data={filteredData} />

            {/* Split Row: Products & Payment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ProductPerformanceChart
                  data={filteredData}
                  selectedProduct={filters.selectedProduct !== 'all' ? filters.selectedProduct : undefined}
                  onSelectProduct={(prod) => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedProduct: prev.selectedProduct === prod ? 'all' : prod,
                    }));
                  }}
                />
              </div>

              <div className="lg:col-span-5">
                <PaymentMethodChart
                  data={filteredData}
                  selectedPaymentMethod={filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined}
                  onSelectPaymentMethod={(pm) => {
                    setFilters((prev) => ({
                      ...prev,
                      paymentMethod: prev.paymentMethod === pm ? 'all' : pm,
                    }));
                  }}
                />
              </div>
            </div>

            {/* Key Commercial Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Top Revenue Generator
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  Premium Tailored Trousers
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  At $175.00/unit, 9 sales generated <strong className="text-slate-900 dark:text-white font-mono">$1,575.00</strong> (14.2% of total store revenue) despite being only 7.8% of units sold.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Volume Driver
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  Classic Fit Chinos
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Led unit sales with <strong className="text-slate-900 dark:text-white font-mono">13 units</strong> sold across the period, generating $1,014.00 and frequently paired in multi-item orders.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Settlement Velocity
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  Electronic & Card Dominance
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Card & eWallet transactions represent over <strong className="text-slate-900 dark:text-white font-mono">75%</strong> of sales volume, with Credit Cards driving the highest average order value.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <ProductPerformanceChart
              data={filteredData}
              selectedProduct={filters.selectedProduct !== 'all' ? filters.selectedProduct : undefined}
              onSelectProduct={(prod) => {
                setFilters((prev) => ({
                  ...prev,
                  selectedProduct: prev.selectedProduct === prod ? 'all' : prod,
                }));
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Category Concentration
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Distribution of apparel merchandise across formal tailoring, core denim, casual trousers, and summer styles.
                </p>
                <div className="space-y-2.5">
                  {[
                    { name: 'Tailored & Formal', rev: 2735, units: 17, share: '24.6%' },
                    { name: 'Casual Trousers', rev: 1779, units: 22, share: '16.0%' },
                    { name: 'Denim & Casual', rev: 1976, units: 20, share: '17.8%' },
                    { name: 'Summer & Resort', rev: 1588, units: 17, share: '14.3%' },
                    { name: 'Workwear', rev: 980, units: 10, share: '8.8%' },
                    { name: 'Athleisure', rev: 750, units: 10, share: '6.7%' },
                    { name: 'Shorts', rev: 580, units: 10, share: '5.2%' },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-sans font-medium text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{cat.units} units</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatCurrency(cat.rev)}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 w-12 text-right">
                          {cat.share}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Price Elasticity & Yield
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  The collection has 12 distinct fixed price points ranging from $58.00 (Multi-Pocket Cargo Shorts) to $175.00 (Premium Tailored Trousers).
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Median Item Price:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">$88.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Weighted Average Unit Price:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{formatCurrency(kpis.avgUnitPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Revenue per Unit Dispersion:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">$58.00 – $175.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <PaymentMethodChart
              data={filteredData}
              selectedPaymentMethod={filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined}
              onSelectPaymentMethod={(pm) => {
                setFilters((prev) => ({
                  ...prev,
                  paymentMethod: prev.paymentMethod === pm ? 'all' : pm,
                }));
              }}
            />
          </div>
        )}

        {activeTab === 'temporal' && (
          <div className="space-y-6">
            <RevenueTimelineChart data={filteredData} />
            <TemporalHeatmap
              data={filteredData}
              selectedDate={filters.startDate === filters.endDate ? filters.startDate : undefined}
              onSelectDate={(date) => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: date,
                  endDate: date,
                  dateRangePreset: 'custom',
                }));
              }}
            />
          </div>
        )}

        {activeTab === 'basket' && (
          <div className="space-y-6">
            <BasketAnalysisChart data={filteredData} />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="space-y-6">
            <CustomVisualizerStudio data={filteredData} />
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <DataTableExplorer
              data={filteredData}
              onDeleteRecord={handleDeleteRecord}
              onEditRecord={(rec) => {
                setEditingRecord(rec);
                setIsModalOpen(true);
              }}
              onOpenAddModal={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">RetailPulse</span>
            <span>·</span>
            <span>Accurate Sales Visualization & Analytics Suite</span>
          </div>
          <div className="flex items-center gap-4 font-mono tabular-nums">
            <span>Aug 15, 2025 – Oct 7, 2025</span>
            <span>·</span>
            <span>{salesData.length} records</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
