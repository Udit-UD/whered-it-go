'use client';

import React, { useState, useMemo, useEffect } from 'react';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Transaction, Category, ApiResponse, TransactionType } from '@/types';
import { tableColumns } from './utils';
import apiService from '@/lib/apiService';
import withPreloader from '@/hocs/withPreloader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import _ from 'lodash';
import { Pencil } from 'lucide-react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [modal, setModal] = useState<string | null>(null);
  const [isStateLoading, setIsStateLoading] = useState(false);

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

  const onRemoveTransaction = (id: string) => {
    setModal(id);
  };

  const onDeleteTransaction = async () => {
    if (!modal) return;
    setIsStateLoading(true);
    try {
      const response = await apiService.delete(`/transactions/${modal}`);
      if (response.success) {
        toast.success('Transaction deleted successfully');
        setModal(null);
        refetchTransactions();
      }
    } catch (error) {
      console.log('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsStateLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto min-h-[90vh] w-3/4 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground text-sm">
              Your monthly expenses are logged here, add or update new expenses in this table
            </p>
          </div>
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
              <Button onClick={onEditClick} size={'sm'} className="gap-1 bg-white text-black">
                <Pencil size={14} /> Edit
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
          onRemoveTransaction={onRemoveTransaction}
          emptyMessage="No transactions found. Add your first transaction to get started."
        />
      </div>
      {!_.isEmpty(modal) ? (
        <Dialog open={true} onOpenChange={() => setModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Transaction</DialogTitle>
            </DialogHeader>
            <div className="w-full text-sm">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </div>
            <DialogFooter>
              <Button onClick={() => setModal(null)} variant={'outline'}>
                Cancel
              </Button>

              <Button variant="destructive" onClick={onDeleteTransaction} disabled={isStateLoading}>
                {isStateLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
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
