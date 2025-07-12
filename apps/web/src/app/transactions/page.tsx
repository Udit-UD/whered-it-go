'use client';

import React, { useState, useMemo, useEffect } from 'react';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Transaction, Category, ApiResponse } from '@/types';
import { Footer } from '../components';
import { tableColumns } from './utils';
import apiService from '@/lib/apiService';
import withPreloader from '@/hocs/withPreloader';
import _ from 'lodash';

type TransactionsResponse = ApiResponse<Transaction[]>;
type CategoriesResponse = ApiResponse<Category[]>;

const TransactionPage = ({
  preloadedData,
  isLoading,
}: {
  isLoading: boolean;
  preloadedData?: Record<string, unknown>;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const categoriesResponse = preloadedData?.categories as CategoriesResponse;
      const userCategoriesList = categoriesResponse?.data || [];

      const transactionResponse = preloadedData?.transactions as TransactionsResponse;
      const transactionData = transactionResponse?.data || [];

      setCategories(userCategoriesList);
      setTransactions(transactionData);
    }
  }, [isLoading, preloadedData]);

  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const refetchTransactions = async () => {
    try {
      const response = await apiService.get<Transaction[]>('/transactions');
      if (response.success) {
        const transactionData = _.get(response, 'data', []);
        setTransactions(transactionData);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction._id !== id));
  };

  return (
    <>
      <div className="container mx-auto min-h-[90vh] w-3/4 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>

        <TransactionTable
          columns={tableColumns}
          data={sortedTransactions}
          categories={categories}
          isLoading={isLoading}
          refetchTransactions={refetchTransactions}
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

const config = {
  apiCalls: [
    {
      key: 'transactions',
      fn: () => apiService.get<TransactionsResponse>('/transactions'),
    },
    {
      key: 'categories',
      fn: () => apiService.get<CategoriesResponse>('/categories'),
    },
  ],
};

export default withPreloader(TransactionPage, config);
