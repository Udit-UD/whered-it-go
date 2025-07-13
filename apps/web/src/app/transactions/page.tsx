'use client';

import React, { useState, useMemo, useEffect } from 'react';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Transaction, Category, ApiResponse, TransactionType } from '@/types';
import { Footer } from '../components';
import { tableColumns } from './utils';
import apiService from '@/lib/apiService';
import withPreloader from '@/hocs/withPreloader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import _ from 'lodash';

interface EditingTransaction {
  id: string;
  description: string;
  amount: string;
  categoryId: string;
  date: Date;
  transactionType?: TransactionType;
  isNew?: boolean;
  isModified?: boolean;
}

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
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNewTransaction, setIsAddingNewTransaction] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<EditingTransaction[]>([]);

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

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onCancelChanges = () => {
    setIsEditing(false);
    setIsAddingNewTransaction(false);
    setPendingChanges([]);
  };

  const handleSaveChanges = async () => {
    if (pendingChanges.length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const newTransactions = pendingChanges.filter(tx => tx.isNew);
      const modifiedTransactions = pendingChanges.filter(tx => tx.isModified && !tx.isNew);

      const promises = [];

      // Bulk create new transactions
      if (newTransactions.length > 0) {
        const newPayload = newTransactions.map(tx => ({
          description: tx.description.trim(),
          amount: Number(tx.amount),
          categoryId: tx.categoryId,
          date: tx.date.toISOString(),
          transactionType: tx.transactionType || 'expense',
        }));
        promises.push(apiService.post('/transactions/bulk-create', newPayload));
      }

      // Bulk update existing transactions
      if (modifiedTransactions.length > 0) {
        const updatePayload = modifiedTransactions.map(tx => ({
          id: tx.id,
          description: tx.description.trim(),
          amount: Number(tx.amount),
          categoryId: tx.categoryId,
          date: tx.date.toISOString(),
          transactionType: tx.transactionType || 'expense',
        }));
        promises.push(apiService.put('/transactions/bulk-update', updatePayload));
      }

      await Promise.all(promises);

      toast.success(`Successfully saved ${pendingChanges.length} transaction(s)`);
      setIsEditing(false);
      setIsAddingNewTransaction(false);
      setPendingChanges([]);
      refetchTransactions();
    } catch (error) {
      toast.error('Failed to save transactions');
      console.error('Error saving transactions:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto min-h-[90vh] w-3/4 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="flex gap-2">
            {isEditing || isAddingNewTransaction ? (
              <>
                <Button size={'sm'} onClick={handleSaveChanges} className="bg-white text-black">
                  Save {pendingChanges.length > 0 && `(${pendingChanges.length})`}
                </Button>
                <Button size={'sm'} onClick={onCancelChanges} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={onEditClick} size={'sm'} className="bg-white text-black">
                Edit
              </Button>
            )}
          </div>
        </div>

        <TransactionTable
          columns={tableColumns}
          data={sortedTransactions}
          categories={categories}
          isLoading={isLoading}
          allowAdd={true}
          isEditing={isEditing}
          isAddingNewRow={isAddingNewTransaction}
          onAddingNewRow={setIsAddingNewTransaction}
          onChangesUpdate={setPendingChanges}
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
