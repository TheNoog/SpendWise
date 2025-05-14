
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction, Transaction, Category, BudgetGoal } from '@/types';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

const initialState: AppState = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  budgetGoals: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    case 'ADD_BUDGET_GOAL':
      return { ...state, budgetGoals: [...state.budgetGoals, action.payload] };
    case 'UPDATE_BUDGET_GOAL':
      return {
        ...state,
        budgetGoals: state.budgetGoals.map((b) =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE_BUDGET_GOAL':
      return {
        ...state,
        budgetGoals: state.budgetGoals.filter((b) => b.id !== action.payload),
      };
    default:
      return state;
  }
}

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudgetGoal: (budgetGoal: Omit<BudgetGoal, 'id'>) => void;
  updateBudgetGoal: (budgetGoal: BudgetGoal) => void;
  deleteBudgetGoal: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

const APP_STATE_STORAGE_KEY = 'spendwiseAppState';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const storedState = localStorage.getItem(APP_STATE_STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState) as AppState;
      // Dates need to be re-hydrated
      parsedState.transactions = parsedState.transactions.map(t => ({ ...t, date: new Date(t.date), endDate: t.endDate ? new Date(t.endDate) : undefined }));
      parsedState.budgetGoals = parsedState.budgetGoals.map(b => ({ ...b, startDate: new Date(b.startDate), endDate: b.endDate ? new Date(b.endDate) : undefined }));
      dispatch({ type: 'LOAD_STATE', payload: parsedState });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...transaction, id: crypto.randomUUID() } });
  };
  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };
  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };
  const addCategory = (category: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: { ...category, id: crypto.randomUUID() } });
  };
  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };
  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };
  const addBudgetGoal = (budgetGoal: Omit<BudgetGoal, 'id'>) => {
    dispatch({ type: 'ADD_BUDGET_GOAL', payload: { ...budgetGoal, id: crypto.randomUUID() } });
  };
  const updateBudgetGoal = (budgetGoal: BudgetGoal) => {
    dispatch({ type: 'UPDATE_BUDGET_GOAL', payload: budgetGoal });
  };
  const deleteBudgetGoal = (id: string) => {
    dispatch({ type: 'DELETE_BUDGET_GOAL', payload: id });
  };

  const getCategoryById = (id: string): Category | undefined => {
    return state.categories.find(cat => cat.id === id);
  }

  return (
    <AppContext.Provider value={{ 
        state, dispatch, 
        addTransaction, updateTransaction, deleteTransaction,
        addCategory, updateCategory, deleteCategory,
        addBudgetGoal, updateBudgetGoal, deleteBudgetGoal,
        getCategoryById
      }}>
      {children}
    </AppContext.Provider>
  );
}
