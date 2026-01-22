
import { Category, TransactionType } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: '🍔', color: 'bg-orange-500', type: TransactionType.EXPENSE },
  { id: '2', name: 'Transport', icon: '🚗', color: 'bg-blue-500', type: TransactionType.EXPENSE },
  { id: '3', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500', type: TransactionType.EXPENSE },
  { id: '4', name: 'Rent', icon: '🏠', color: 'bg-indigo-500', type: TransactionType.EXPENSE },
  { id: '5', name: 'Entertainment', icon: '🎬', color: 'bg-purple-500', type: TransactionType.EXPENSE },
  { id: '6', name: 'Salary', icon: '💰', color: 'bg-green-500', type: TransactionType.INCOME },
  { id: '7', name: 'Freelance', icon: '💻', color: 'bg-teal-500', type: TransactionType.INCOME },
  { id: '8', name: 'Investment', icon: '📈', color: 'bg-cyan-500', type: TransactionType.INCOME },
];

export const CURRENCIES = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];
