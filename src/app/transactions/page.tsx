'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import TransactionTable, { TableColumn } from '@/components/dashboard/TransactionTable';
import { Transaction, Category } from '@/types';
import { Footer } from '../components';

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#FF6B6B',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Shopping',
    icon: '🛍️',
    color: '#45B7D1',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'Entertainment',
    icon: '🎬',
    color: '#96CEB4',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Bills & Utilities',
    icon: '📄',
    color: '#FFEAA7',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '6',
    name: 'Healthcare',
    icon: '🏥',
    color: '#DDA0DD',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '7',
    name: 'Salary',
    icon: '💰',
    color: '#98D8C8',
    userId: '1',
    createdAt: '',
    updatedAt: '',
  },
];

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: -45.5,
    description: 'Lunch at Pizza Place',
    categoryId: '1',
    category: mockCategories[0],
    date: '2025-07-01',
    userId: '1',
    transactionType: 'expense',
    createdAt: '2025-07-01',
    updatedAt: '2025-07-01',
  },
  {
    id: '2',
    amount: -25.0,
    description: 'Gas Station',
    categoryId: '2',
    category: mockCategories[1],
    date: '2025-07-02',
    userId: '1',
    transactionType: 'expense',
    createdAt: '2025-07-02',
    updatedAt: '2025-07-02',
  },
  {
    id: '3',
    amount: 3000.0,
    description: 'Monthly Salary',
    categoryId: '7',
    category: mockCategories[6],
    date: '2025-07-01',
    userId: '1',
    transactionType: 'income',
    createdAt: '2025-07-01',
    updatedAt: '2025-07-01',
  },
  {
    id: '4',
    amount: -120.0,
    description: 'Grocery Shopping',
    categoryId: '3',
    category: mockCategories[2],
    date: '2025-07-03',
    userId: '1',
    transactionType: 'expense',
    createdAt: '2025-07-03',
    updatedAt: '2025-07-03',
  },
];

// Table columns configuration
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', className: 'px-4 py-2 w-20', width: '100px' },
  { key: 'description', label: 'Title', className: 'px-4 py-2 min-w-48', width: '200px' },
  { key: 'category', label: 'Category', className: 'px-4 py-2 w-40', width: '160px' },
  { key: 'date', label: 'Date', className: 'px-4 py-2 w-32', width: '120px' },
  { key: 'transactionType', label: 'Type', className: 'px-4 py-2 w-24', width: '96px' },
  { key: 'amount', label: 'Amount', className: 'px-4 py-2 w-32 ', width: '120px' },
];

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);

  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const handleAddTransaction = (
    newTransactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleEditTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
          : transaction
      )
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Simulate loading state
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className="container mx-auto min-h-[90vh] w-3/4 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="gapx-4 flex py-2">
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              Refresh
            </Button>
          </div>
        </div>

        <TransactionTable
          columns={columns}
          data={sortedTransactions}
          categories={mockCategories}
          isLoading={isLoading}
          onAdd={handleAddTransaction}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          showActions={true}
          allowAdd={true}
          allowEdit={true}
          allowDelete={true}
          emptyMessage="No transactions found. Add your first transaction to get started."
        />
      </div>
      <Footer />
    </>
  );
};

export default TransactionPage;
