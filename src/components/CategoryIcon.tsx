import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  ShoppingBag,
  PlusCircle,
  Utensils,
  Home,
  Car,
  Zap,
  Film,
  HeartPulse,
  BookOpen,
  Tag,
  HelpCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';

interface CategoryIconProps {
  iconName?: string;
  className?: string;
  type?: 'income' | 'expense';
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = 'w-5 h-5', type }) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'PlusCircle':
      return <PlusCircle className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'ArrowDownLeft':
      return <ArrowDownLeft className={className} />;
    case 'ArrowUpRight':
      return <ArrowUpRight className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    default:
      if (type === 'income') {
        return <ArrowDownLeft className={className} />;
      }
      if (type === 'expense') {
        return <ArrowUpRight className={className} />;
      }
      return <HelpCircle className={className} />;
  }
};
