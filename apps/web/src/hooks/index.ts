import { useState, useEffect } from 'react';
import type { Budget, Transaction } from '@/types';

// Custom hook for managing local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Custom hook for debouncing values
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for managing async operations
export function useAsync<T, E = string>(asyncFunction: () => Promise<T>, immediate = true) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
    } catch (error) {
      setError(error as E);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { execute, status, data, error };
}

// Custom hook for currency formatting
export function useCurrency(defaultCurrency: string = 'USD') {
  const [currency, setCurrency] = useLocalStorage('preferred-currency', defaultCurrency);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return { currency, setCurrency, formatAmount };
}

// Custom hook for budget calculations
export function useBudgetCalculations(budgets: Budget[], transactions: Transaction[]) {
  const [calculations, setCalculations] = useState({
    totalBudget: 0,
    totalSpent: 0,
    utilization: 0,
    remainingBudget: 0,
  });

  useEffect(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const remainingBudget = totalBudget - totalSpent;

    setCalculations({
      totalBudget,
      totalSpent,
      utilization,
      remainingBudget,
    });
  }, [budgets, transactions]);

  return calculations;
}

// Custom hook for financial summary
export function useFinancialSummary(transactions: Transaction[]) {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    const income = transactions
      .filter(t => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setSummary({
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      transactionCount: transactions.length,
    });
  }, [transactions]);

  return summary;
}
