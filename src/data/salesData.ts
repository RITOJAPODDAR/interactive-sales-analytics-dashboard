export interface SalesRecord {
  id: string;
  orderNumber: string;
  product: string;
  price: number;
  date: string;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'eWallet' | 'Cash';
  category?: string;
}

export const PRODUCT_CATEGORIES: Record<string, string> = {
  'Slim-Fit Denim Jeans': 'Denim & Casual',
  'Technical Performance Joggers': 'Athleisure',
  'Classic Fit Chinos': 'Casual Trousers',
  'Flannel-Lined Canvas Work Pants': 'Workwear',
  'Double-Pleated Khaki Trousers': 'Smart Casual',
  'Relaxed Fit Corduroy Trousers': 'Casual Trousers',
  'Multi-Pocket Cargo Shorts': 'Shorts',
  'Premium Tailored Trousers': 'Tailored & Formal',
  'Classic Denim Overalls': 'Denim & Casual',
  'Drawstring Linen Trousers': 'Summer & Resort',
  'Tailored Wool Dress Trousers': 'Tailored & Formal',
  'Striped Seersucker Trousers': 'Summer & Resort',
};

export const INITIAL_SALES_DATA: SalesRecord[] = [
  // Page 1 (31 records)
  { id: 'rec-1', orderNumber: 'TT-1001', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-08-15', paymentMethod: 'Credit Card' },
  { id: 'rec-2', orderNumber: 'TT-1001', product: 'Technical Performance Joggers', price: 75.0, date: '2025-08-15', paymentMethod: 'Credit Card' },
  { id: 'rec-3', orderNumber: 'TT-1002', product: 'Classic Fit Chinos', price: 78.0, date: '2025-08-15', paymentMethod: 'eWallet' },
  { id: 'rec-4', orderNumber: 'TT-1003', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-08-16', paymentMethod: 'Cash' },
  { id: 'rec-5', orderNumber: 'TT-1004', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-08-16', paymentMethod: 'Credit Card' },
  { id: 'rec-6', orderNumber: 'TT-1005', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-08-17', paymentMethod: 'Debit Card' },
  { id: 'rec-7', orderNumber: 'TT-1005', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-08-17', paymentMethod: 'eWallet' },
  { id: 'rec-8', orderNumber: 'TT-1006', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-08-18', paymentMethod: 'Credit Card' },
  { id: 'rec-9', orderNumber: 'TT-1007', product: 'Classic Denim Overalls', price: 115.0, date: '2025-08-18', paymentMethod: 'eWallet' },
  { id: 'rec-10', orderNumber: 'TT-1008', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-08-19', paymentMethod: 'Debit Card' },
  { id: 'rec-11', orderNumber: 'TT-1009', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-08-19', paymentMethod: 'Credit Card' },
  { id: 'rec-12', orderNumber: 'TT-1009', product: 'Classic Fit Chinos', price: 78.0, date: '2025-08-19', paymentMethod: 'Cash' },
  { id: 'rec-13', orderNumber: 'TT-1010', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-08-20', paymentMethod: 'Cash' },
  { id: 'rec-14', orderNumber: 'TT-1011', product: 'Technical Performance Joggers', price: 75.0, date: '2025-08-20', paymentMethod: 'eWallet' },
  { id: 'rec-15', orderNumber: 'TT-1012', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-08-21', paymentMethod: 'Cash' },
  { id: 'rec-16', orderNumber: 'TT-1013', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-08-21', paymentMethod: 'Debit Card' },
  { id: 'rec-17', orderNumber: 'TT-1014', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-08-22', paymentMethod: 'Debit Card' },
  { id: 'rec-18', orderNumber: 'TT-1015', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-08-22', paymentMethod: 'eWallet' },
  { id: 'rec-19', orderNumber: 'TT-1015', product: 'Classic Fit Chinos', price: 78.0, date: '2025-08-22', paymentMethod: 'Debit Card' },
  { id: 'rec-20', orderNumber: 'TT-1016', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-08-23', paymentMethod: 'Credit Card' },
  { id: 'rec-21', orderNumber: 'TT-1017', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-08-24', paymentMethod: 'Credit Card' },
  { id: 'rec-22', orderNumber: 'TT-1018', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-08-24', paymentMethod: 'Cash' },
  { id: 'rec-23', orderNumber: 'TT-1018', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-08-24', paymentMethod: 'Cash' },
  { id: 'rec-24', orderNumber: 'TT-1019', product: 'Technical Performance Joggers', price: 75.0, date: '2025-08-25', paymentMethod: 'Debit Card' },
  { id: 'rec-25', orderNumber: 'TT-1020', product: 'Classic Denim Overalls', price: 115.0, date: '2025-08-25', paymentMethod: 'Credit Card' },
  { id: 'rec-26', orderNumber: 'TT-1021', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-08-26', paymentMethod: 'Credit Card' },
  { id: 'rec-27', orderNumber: 'TT-1022', product: 'Classic Fit Chinos', price: 78.0, date: '2025-08-26', paymentMethod: 'Debit Card' },
  { id: 'rec-28', orderNumber: 'TT-1023', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-08-27', paymentMethod: 'Debit Card' },
  { id: 'rec-29', orderNumber: 'TT-1024', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-08-27', paymentMethod: 'eWallet' },
  { id: 'rec-30', orderNumber: 'TT-1025', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-08-28', paymentMethod: 'eWallet' },
  { id: 'rec-31', orderNumber: 'TT-1025', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-08-28', paymentMethod: 'Debit Card' },

  // Page 2 (31 records)
  { id: 'rec-32', orderNumber: 'TT-1026', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-08-29', paymentMethod: 'Debit Card' },
  { id: 'rec-33', orderNumber: 'TT-1027', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-08-29', paymentMethod: 'Credit Card' },
  { id: 'rec-34', orderNumber: 'TT-1028', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-08-30', paymentMethod: 'eWallet' },
  { id: 'rec-35', orderNumber: 'TT-1029', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-08-30', paymentMethod: 'Debit Card' },
  { id: 'rec-36', orderNumber: 'TT-1029', product: 'Classic Fit Chinos', price: 78.0, date: '2025-08-30', paymentMethod: 'Debit Card' },
  { id: 'rec-37', orderNumber: 'TT-1030', product: 'Technical Performance Joggers', price: 75.0, date: '2025-08-31', paymentMethod: 'Credit Card' },
  { id: 'rec-38', orderNumber: 'TT-1031', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-01', paymentMethod: 'eWallet' },
  { id: 'rec-39', orderNumber: 'TT-1032', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-09-01', paymentMethod: 'Credit Card' },
  { id: 'rec-40', orderNumber: 'TT-1033', product: 'Classic Denim Overalls', price: 115.0, date: '2025-09-02', paymentMethod: 'eWallet' },
  { id: 'rec-41', orderNumber: 'TT-1034', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-09-02', paymentMethod: 'Cash' },
  { id: 'rec-42', orderNumber: 'TT-1034', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-02', paymentMethod: 'Cash' },
  { id: 'rec-43', orderNumber: 'TT-1035', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-09-03', paymentMethod: 'Debit Card' },
  { id: 'rec-44', orderNumber: 'TT-1036', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-09-03', paymentMethod: 'Credit Card' },
  { id: 'rec-45', orderNumber: 'TT-1037', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-09-04', paymentMethod: 'Debit Card' },
  { id: 'rec-46', orderNumber: 'TT-1038', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-09-04', paymentMethod: 'eWallet' },
  { id: 'rec-47', orderNumber: 'TT-1039', product: 'Technical Performance Joggers', price: 75.0, date: '2025-09-05', paymentMethod: 'Cash' },
  { id: 'rec-48', orderNumber: 'TT-1040', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-05', paymentMethod: 'Debit Card' },
  { id: 'rec-49', orderNumber: 'TT-1040', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-09-05', paymentMethod: 'eWallet' },
  { id: 'rec-50', orderNumber: 'TT-1041', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-06', paymentMethod: 'Cash' },
  { id: 'rec-51', orderNumber: 'TT-1042', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-09-06', paymentMethod: 'Credit Card' },
  { id: 'rec-52', orderNumber: 'TT-1043', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-09-07', paymentMethod: 'Credit Card' },
  { id: 'rec-53', orderNumber: 'TT-1044', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-09-08', paymentMethod: 'Cash' },
  { id: 'rec-54', orderNumber: 'TT-1045', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-09-08', paymentMethod: 'eWallet' },
  { id: 'rec-55', orderNumber: 'TT-1046', product: 'Classic Denim Overalls', price: 115.0, date: '2025-09-09', paymentMethod: 'Cash' },
  { id: 'rec-56', orderNumber: 'TT-1047', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-09-09', paymentMethod: 'eWallet' },
  { id: 'rec-57', orderNumber: 'TT-1047', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-09', paymentMethod: 'Cash' },
  { id: 'rec-58', orderNumber: 'TT-1048', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-09-10', paymentMethod: 'Credit Card' },
  { id: 'rec-59', orderNumber: 'TT-1049', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-10', paymentMethod: 'Cash' },
  { id: 'rec-60', orderNumber: 'TT-1050', product: 'Technical Performance Joggers', price: 75.0, date: '2025-09-11', paymentMethod: 'Debit Card' },
  { id: 'rec-61', orderNumber: 'TT-1051', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-09-12', paymentMethod: 'Debit Card' },
  { id: 'rec-62', orderNumber: 'TT-1052', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-09-12', paymentMethod: 'eWallet' },

  // Page 3 (31 records)
  { id: 'rec-63', orderNumber: 'TT-1053', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-09-13', paymentMethod: 'eWallet' },
  { id: 'rec-64', orderNumber: 'TT-1054', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-09-13', paymentMethod: 'Cash' },
  { id: 'rec-65', orderNumber: 'TT-1054', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-09-13', paymentMethod: 'Credit Card' },
  { id: 'rec-66', orderNumber: 'TT-1055', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-09-14', paymentMethod: 'eWallet' },
  { id: 'rec-67', orderNumber: 'TT-1056', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-14', paymentMethod: 'Debit Card' },
  { id: 'rec-68', orderNumber: 'TT-1057', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-15', paymentMethod: 'eWallet' },
  { id: 'rec-69', orderNumber: 'TT-1058', product: 'Classic Denim Overalls', price: 115.0, date: '2025-09-16', paymentMethod: 'Debit Card' },
  { id: 'rec-70', orderNumber: 'TT-1059', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-09-16', paymentMethod: 'Debit Card' },
  { id: 'rec-71', orderNumber: 'TT-1059', product: 'Technical Performance Joggers', price: 75.0, date: '2025-09-16', paymentMethod: 'Debit Card' },
  { id: 'rec-72', orderNumber: 'TT-1060', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-09-17', paymentMethod: 'Cash' },
  { id: 'rec-73', orderNumber: 'TT-1061', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-09-17', paymentMethod: 'Credit Card' },
  { id: 'rec-74', orderNumber: 'TT-1062', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-09-18', paymentMethod: 'eWallet' },
  { id: 'rec-75', orderNumber: 'TT-1063', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-09-18', paymentMethod: 'Credit Card' },
  { id: 'rec-76', orderNumber: 'TT-1064', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-19', paymentMethod: 'Credit Card' },
  { id: 'rec-77', orderNumber: 'TT-1065', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-09-19', paymentMethod: 'eWallet' },
  { id: 'rec-78', orderNumber: 'TT-1065', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-19', paymentMethod: 'eWallet' },
  { id: 'rec-79', orderNumber: 'TT-1066', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-09-20', paymentMethod: 'eWallet' },
  { id: 'rec-80', orderNumber: 'TT-1067', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-09-21', paymentMethod: 'eWallet' },
  { id: 'rec-81', orderNumber: 'TT-1068', product: 'Technical Performance Joggers', price: 75.0, date: '2025-09-21', paymentMethod: 'Credit Card' },
  { id: 'rec-82', orderNumber: 'TT-1069', product: 'Classic Denim Overalls', price: 115.0, date: '2025-09-22', paymentMethod: 'eWallet' },
  { id: 'rec-83', orderNumber: 'TT-1070', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-09-22', paymentMethod: 'Cash' },
  { id: 'rec-84', orderNumber: 'TT-1071', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-09-23', paymentMethod: 'Credit Card' },
  { id: 'rec-85', orderNumber: 'TT-1072', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-23', paymentMethod: 'eWallet' },
  { id: 'rec-86', orderNumber: 'TT-1072', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-09-23', paymentMethod: 'eWallet' },
  { id: 'rec-87', orderNumber: 'TT-1073', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-09-24', paymentMethod: 'Credit Card' },
  { id: 'rec-88', orderNumber: 'TT-1074', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-24', paymentMethod: 'Debit Card' },
  { id: 'rec-89', orderNumber: 'TT-1075', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-09-25', paymentMethod: 'Cash' },
  { id: 'rec-90', orderNumber: 'TT-1076', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-09-26', paymentMethod: 'Cash' },
  { id: 'rec-91', orderNumber: 'TT-1077', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-09-26', paymentMethod: 'Cash' },
  { id: 'rec-92', orderNumber: 'TT-1078', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-09-27', paymentMethod: 'Cash' },
  { id: 'rec-93', orderNumber: 'TT-1079', product: 'Technical Performance Joggers', price: 75.0, date: '2025-09-27', paymentMethod: 'Debit Card' },

  // Page 4 (23 records)
  { id: 'rec-94', orderNumber: 'TT-1079', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-09-27', paymentMethod: 'Cash' },
  { id: 'rec-95', orderNumber: 'TT-1080', product: 'Classic Denim Overalls', price: 115.0, date: '2025-09-28', paymentMethod: 'Debit Card' },
  { id: 'rec-96', orderNumber: 'TT-1081', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-09-28', paymentMethod: 'Cash' },
  { id: 'rec-97', orderNumber: 'TT-1082', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-09-29', paymentMethod: 'Cash' },
  { id: 'rec-98', orderNumber: 'TT-1083', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-09-29', paymentMethod: 'eWallet' },
  { id: 'rec-99', orderNumber: 'TT-1084', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-09-30', paymentMethod: 'eWallet' },
  { id: 'rec-100', orderNumber: 'TT-1084', product: 'Classic Fit Chinos', price: 78.0, date: '2025-09-30', paymentMethod: 'Debit Card' },
  { id: 'rec-101', orderNumber: 'TT-1085', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-10-01', paymentMethod: 'Credit Card' },
  { id: 'rec-102', orderNumber: 'TT-1086', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-10-01', paymentMethod: 'Credit Card' },
  { id: 'rec-103', orderNumber: 'TT-1087', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-10-02', paymentMethod: 'eWallet' },
  { id: 'rec-104', orderNumber: 'TT-1088', product: 'Technical Performance Joggers', price: 75.0, date: '2025-10-02', paymentMethod: 'Cash' },
  { id: 'rec-105', orderNumber: 'TT-1089', product: 'Multi-Pocket Cargo Shorts', price: 58.0, date: '2025-10-03', paymentMethod: 'Credit Card' },
  { id: 'rec-106', orderNumber: 'TT-1090', product: 'Drawstring Linen Trousers', price: 92.0, date: '2025-10-03', paymentMethod: 'Credit Card' },
  { id: 'rec-107', orderNumber: 'TT-1091', product: 'Classic Denim Overalls', price: 115.0, date: '2025-10-04', paymentMethod: 'Cash' },
  { id: 'rec-108', orderNumber: 'TT-1092', product: 'Tailored Wool Dress Trousers', price: 145.0, date: '2025-10-04', paymentMethod: 'Cash' },
  { id: 'rec-109', orderNumber: 'TT-1092', product: 'Classic Fit Chinos', price: 78.0, date: '2025-10-04', paymentMethod: 'Debit Card' },
  { id: 'rec-110', orderNumber: 'TT-1093', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-10-05', paymentMethod: 'Debit Card' },
  { id: 'rec-111', orderNumber: 'TT-1094', product: 'Striped Seersucker Trousers', price: 95.0, date: '2025-10-05', paymentMethod: 'Cash' },
  { id: 'rec-112', orderNumber: 'TT-1095', product: 'Relaxed Fit Corduroy Trousers', price: 85.0, date: '2025-10-06', paymentMethod: 'eWallet' },
  { id: 'rec-113', orderNumber: 'TT-1096', product: 'Premium Tailored Trousers', price: 175.0, date: '2025-10-06', paymentMethod: 'Cash' },
  { id: 'rec-114', orderNumber: 'TT-1097', product: 'Flannel-Lined Canvas Work Pants', price: 98.0, date: '2025-10-07', paymentMethod: 'Credit Card' },
  { id: 'rec-115', orderNumber: 'TT-1097', product: 'Slim-Fit Denim Jeans', price: 88.0, date: '2025-10-07', paymentMethod: 'Debit Card' },
  { id: 'rec-116', orderNumber: 'TT-1098', product: 'Double-Pleated Khaki Trousers', price: 82.0, date: '2025-10-07', paymentMethod: 'eWallet' },
];

export const ALL_PRODUCTS = Array.from(new Set(INITIAL_SALES_DATA.map((d) => d.product))).sort();
export const ALL_PAYMENT_METHODS: Array<'Credit Card' | 'Debit Card' | 'eWallet' | 'Cash'> = [
  'Credit Card',
  'Debit Card',
  'eWallet',
  'Cash',
];

export const PAYMENT_METHOD_COLORS: Record<string, { bg: string; text: string; fill: string; border: string }> = {
  'Credit Card': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', fill: '#6366F1', border: 'border-indigo-200 dark:border-indigo-800' },
  'Debit Card': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', fill: '#10B981', border: 'border-emerald-200 dark:border-emerald-800' },
  'eWallet': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', fill: '#F59E0B', border: 'border-amber-200 dark:border-amber-800' },
  'Cash': { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-600 dark:text-sky-400', fill: '#0EA5E9', border: 'border-sky-200 dark:border-sky-800' },
};

export const PRODUCT_COLORS = [
  '#6366F1', // Indigo
  '#0EA5E9', // Sky
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#3B82F6', // Blue
  '#D946EF', // Fuchsia
  '#84CC16', // Lime
  '#64748B', // Slate
];

export function getProductColor(productName: string): string {
  const idx = ALL_PRODUCTS.indexOf(productName);
  return idx >= 0 ? PRODUCT_COLORS[idx % PRODUCT_COLORS.length] : '#6366F1';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayOfWeekName(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}
