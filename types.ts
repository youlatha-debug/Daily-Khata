
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  type: TransactionType;
  image?: string; // Base64
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: 'monthly';
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  currency: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export interface FinancialInsight {
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'positive';
}
