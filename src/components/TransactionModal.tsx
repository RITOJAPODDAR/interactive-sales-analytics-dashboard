import React, { useState, useEffect } from 'react';
import { SalesRecord, ALL_PRODUCTS, ALL_PAYMENT_METHODS } from '../data/salesData';
import { X, Check } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<SalesRecord>) => void;
  initialRecord?: SalesRecord | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}) => {
  const [orderNumber, setOrderNumber] = useState('TT-1099');
  const [product, setProduct] = useState(ALL_PRODUCTS[0]);
  const [price, setPrice] = useState('88.00');
  const [date, setDate] = useState('2025-10-08');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Debit Card' | 'eWallet' | 'Cash'>('Credit Card');

  useEffect(() => {
    if (initialRecord) {
      setOrderNumber(initialRecord.orderNumber);
      setProduct(initialRecord.product);
      setPrice(initialRecord.price.toFixed(2));
      setDate(initialRecord.date);
      setPaymentMethod(initialRecord.paymentMethod);
    } else {
      setOrderNumber(`TT-${Math.floor(1100 + Math.random() * 50)}`);
      setProduct(ALL_PRODUCTS[0]);
      setPrice('88.00');
      setDate('2025-10-08');
      setPaymentMethod('Credit Card');
    }
  }, [initialRecord, isOpen]);

  // When product changes, suggest the typical catalog price
  const handleProductChange = (prodName: string) => {
    setProduct(prodName);
    const priceLookup: Record<string, string> = {
      'Slim-Fit Denim Jeans': '88.00',
      'Technical Performance Joggers': '75.00',
      'Classic Fit Chinos': '78.00',
      'Flannel-Lined Canvas Work Pants': '98.00',
      'Double-Pleated Khaki Trousers': '82.00',
      'Relaxed Fit Corduroy Trousers': '85.00',
      'Multi-Pocket Cargo Shorts': '58.00',
      'Premium Tailored Trousers': '175.00',
      'Classic Denim Overalls': '115.00',
      'Drawstring Linen Trousers': '92.00',
      'Tailored Wool Dress Trousers': '145.00',
      'Striped Seersucker Trousers': '95.00',
    };
    if (priceLookup[prodName]) {
      setPrice(priceLookup[prodName]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;

    onSave({
      id: initialRecord ? initialRecord.id : `rec-${Date.now()}`,
      orderNumber: orderNumber.trim() || 'TT-1100',
      product,
      price: parsedPrice,
      date,
      paymentMethod,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {initialRecord ? 'Edit Sales Record' : 'Add New Order Item'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          {initialRecord
            ? `Updating line item for order ${initialRecord.orderNumber}`
            : 'Append a new transactional record to the active analytics dataset'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Order Number
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TT-1099"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Product Style
            </label>
            <select
              value={product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {ALL_PRODUCTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono tabular-nums focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Payment Settlement Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-3 py-2 rounded-lg border text-left font-medium transition-colors ${
                    paymentMethod === pm
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{initialRecord ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
