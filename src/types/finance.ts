export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  time?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  type: 'all' | 'income' | 'expense';
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}
