import React from 'react';
import { Search, X, Calendar, DollarSign, Filter } from 'lucide-react';
import { ALL_PRODUCTS, ALL_PAYMENT_METHODS } from '../data/salesData';

export interface FilterState {
  searchQuery: string;
  paymentMethod: string; // 'all' | payment method
  selectedProduct: string; // 'all' | product
  dateRangePreset: 'all' | 'august' | 'september' | 'october' | 'custom';
  startDate: string;
  endDate: string;
  minPrice: number;
  maxPrice: number;
}

interface FilterToolbarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilters,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.paymentMethod !== 'all' ||
    filters.selectedProduct !== 'all' ||
    filters.dateRangePreset !== 'all' ||
    filters.minPrice > 50 ||
    filters.maxPrice < 180;

  const handleReset = () => {
    onChangeFilters({
      searchQuery: '',
      paymentMethod: 'all',
      selectedProduct: 'all',
      dateRangePreset: 'all',
      startDate: '2025-08-15',
      endDate: '2025-10-07',
      minPrice: 50,
      maxPrice: 180,
    });
  };

  const handleDatePreset = (preset: 'all' | 'august' | 'september' | 'october') => {
    let start = '2025-08-15';
    let end = '2025-10-07';
    if (preset === 'august') {
      start = '2025-08-15';
      end = '2025-08-31';
    } else if (preset === 'september') {
      start = '2025-09-01';
      end = '2025-09-30';
    } else if (preset === 'october') {
      start = '2025-10-01';
      end = '2025-10-07';
    }
    onChangeFilters({
      ...filters,
      dateRangePreset: preset,
      startDate: start,
      endDate: end,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order # (e.g. TT-1001) or product..."
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date presets */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0 overflow-x-auto">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Period:
          </span>
          {(['all', 'august', 'september', 'october'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handleDatePreset(preset)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filters.dateRangePreset === preset
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {preset === 'all'
                ? 'All Dates'
                : preset === 'august'
                ? 'Aug 2025'
                : preset === 'september'
                ? 'Sep 2025'
                : 'Oct 2025'}
            </button>
          ))}
        </div>

        {/* Reset filter state */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Showing <strong className="text-slate-900 dark:text-white font-semibold">{filteredCount}</strong> of{' '}
            {totalCount} items
          </div>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Payment Method & Product & Price Dropdowns */}
      <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
        {/* Payment Methods */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Payment:</span>
          <button
            onClick={() => onChangeFilters({ ...filters, paymentMethod: 'all' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filters.paymentMethod === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          {ALL_PAYMENT_METHODS.map((pm) => (
            <button
              key={pm}
              onClick={() => onChangeFilters({ ...filters, paymentMethod: pm })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.paymentMethod === pm
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Product selector */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Product:</span>
          <select
            value={filters.selectedProduct}
            onChange={(e) => onChangeFilters({ ...filters, selectedProduct: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All 12 Apparel Products</option>
            {ALL_PRODUCTS.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        {/* Price Slider */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-medium flex items-center">
            <DollarSign className="w-3 h-3 inline" /> Max:
          </span>
          <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white min-w-[40px]">
            ${filters.maxPrice}
          </span>
          <input
            type="range"
            min="58"
            max="180"
            step="1"
            value={filters.maxPrice}
            onChange={(e) => onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
