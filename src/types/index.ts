
import type { LucideIcon } from 'lucide-react';

export type TransactionType = 'income' | 'expense';
export type Frequency = 'once' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'yearly';
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Category {
  id: string;
  name: string;
  icon?: string; // Lucide icon name string
  type: TransactionType;
  color?: string; // Optional color for the category
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: Date;
  description?: string;
  frequency: Frequency;
  endDate?: Date; // For recurring transactions
}

export interface BudgetGoal {
  id: string;
  name: string;
  categoryId?: string; // Optional: if budget is for a specific category
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date; // For custom period or to signify end of recurring budget
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgetGoals: BudgetGoal[];
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string } // id
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string } // id
  | { type: 'ADD_BUDGET_GOAL'; payload: BudgetGoal }
  | { type: 'UPDATE_BUDGET_GOAL'; payload: BudgetGoal }
  | { type: 'DELETE_BUDGET_GOAL'; payload: string } // id
  | { type: 'LOAD_STATE'; payload: AppState };
