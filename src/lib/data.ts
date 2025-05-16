import type { Category, Transaction, Budget } from '@/types';

export const initialCategories: Category[] = [
  { id: 'cat1', name: 'Groceries', iconName: 'ShoppingCart' },
  { id: 'cat2', name: 'Utilities', iconName: 'Receipt' },
  { id: 'cat3', name: 'Rent/Mortgage', iconName: 'Home' },
  { id: 'cat4', name: 'Transportation', iconName: 'Car' },
  { id: 'cat5', name: 'Entertainment', iconName: 'Film' },
  { id: 'cat6', name: 'Dining Out', iconName: 'Utensils' },
  { id: 'cat7', name: 'Healthcare', iconName: 'HeartPulse' },
  { id: 'cat8', name: 'Shopping', iconName: 'Shirt' },
  { id: 'cat9', name: 'Travel', iconName: 'Plane' },
  { id: 'cat10', name: 'Other', iconName: 'HelpCircle' },
];

const today = new Date();
const getIsoDate = (daysAgo: number = 0): string => {
  const date = new Date(today);
  date.setDate(today.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const initialTransactions: Transaction[] = [
  { id: 'txn1', date: getIsoDate(1), vendor: 'SuperMart', amount: 75.50, categoryId: 'cat1', description: 'Weekly groceries' },
  { id: 'txn2', date: getIsoDate(2), vendor: 'Edison Electric', amount: 120.00, categoryId: 'cat2', description: 'Electricity bill' },
  { id: 'txn3', date: getIsoDate(3), vendor: 'City Gas', amount: 45.20, categoryId: 'cat2' },
  { id: 'txn4', date: getIsoDate(5), vendor: 'Metro Transit', amount: 50.00, categoryId: 'cat4', description: 'Monthly pass' },
  { id: 'txn5', date: getIsoDate(7), vendor: 'CinemaPlex', amount: 32.00, categoryId: 'cat5' },
  { id: 'txn6', date: getIsoDate(10), vendor: 'The Italian Place', amount: 65.80, categoryId: 'cat6', description: 'Dinner with friends' },
  { id: 'txn7', date: getIsoDate(0), vendor: 'Unknown Vendor', amount: 25.00, categoryId: 'cat10', description: 'Uncategorized item' },
];

const currentMonthYear = today.toISOString().slice(0, 7); // YYYY-MM

export const initialBudgets: Budget[] = [
  { id: 'bud1', categoryId: 'cat1', amount: 400, monthYear: currentMonthYear },
  { id: 'bud2', categoryId: 'cat2', amount: 200, monthYear: currentMonthYear },
  { id: 'bud3', categoryId: 'cat6', amount: 250, monthYear: currentMonthYear },
  { id: 'bud4', categoryId: 'cat5', amount: 150, monthYear: currentMonthYear },
];

export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(20, 80%, 60%)', // Additional distinct colors
  'hsl(260, 70%, 65%)',
  'hsl(320, 65%, 68%)',
];
