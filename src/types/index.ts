import type { LucideIcon } from 'lucide-react';

export type CategoryIconName = 
  | 'ShoppingCart' | 'Receipt' | 'Film' | 'Car' | 'Home' 
  | 'Briefcase' | 'Shirt' | 'HeartPulse' | 'BookOpen' | 'Gift' 
  | 'Plane' | 'Utensils' | 'HelpCircle';

export interface Category {
  id: string;
  name: string;
  iconName: CategoryIconName;
}

export interface Transaction {
  id: string;
  date: string; // ISO string date
  vendor: string;
  amount: number;
  categoryId: string;
  description?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  monthYear: string; // Format: "YYYY-MM"
}

// For chart data
export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}
