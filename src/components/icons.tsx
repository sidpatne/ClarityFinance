import {
  ShoppingCart, Receipt, Film, Car, Home, Briefcase, Shirt, HeartPulse, BookOpen, Gift, HelpCircle, Plane, Utensils, type LucideIcon
} from 'lucide-react';
import type { CategoryIconName } from '@/types';

export const CATEGORY_ICONS_MAP: Record<CategoryIconName, LucideIcon> = {
  ShoppingCart,
  Receipt,
  Film,
  Car,
  Home,
  Briefcase,
  Shirt,
  HeartPulse,
  BookOpen,
  Gift,
  Plane,
  Utensils,
  HelpCircle,
};

interface CategoryIconProps extends React.SVGProps<SVGSVGElement> {
  name: CategoryIconName;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  const IconComponent = CATEGORY_ICONS_MAP[name] || CATEGORY_ICONS_MAP.HelpCircle;
  return <IconComponent {...props} />;
};
