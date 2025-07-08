// Example usage of TransactionTable component in other parts of the application

import React from 'react';
import { TransactionTable, TableColumn } from '@/components/dashboard';
import { Transaction, Category } from '@/types';

// Example: Using TransactionTable in a Dashboard component
const DashboardTransactions = () => {
  // Simplified columns for dashboard view
  const dashboardColumns: TableColumn[] = [
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
  ];

  const recentTransactions: Transaction[] = []; // Your data here
  const categories: Category[] = []; // Your categories here

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
      <TransactionTable
        columns={dashboardColumns}
        data={recentTransactions}
        categories={categories}
        showActions={false} // Hide actions in dashboard view
        allowAdd={false}
        allowEdit={false}
        allowDelete={false}
        emptyMessage="No recent transactions"
      />
    </div>
  );
};

// Example: Using TransactionTable in a modal or readonly view
const TransactionModal = ({
  transactions,
  categories,
  onClose,
}: {
  transactions: Transaction[];
  categories: Category[];
  onClose: () => void;
}) => {
  const modalColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'description', label: 'Title' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <button onClick={onClose}>×</button>
        </div>

        <TransactionTable
          columns={modalColumns}
          data={transactions}
          categories={categories}
          isLoading={false}
          showActions={false}
          allowAdd={false}
          allowEdit={false}
          allowDelete={false}
          emptyMessage="No transactions to display"
        />
      </div>
    </div>
  );
};

// Example: Using TransactionTable with custom columns and limited functionality
const ExpenseOnlyTable = () => {
  const expenseColumns: TableColumn[] = [
    { key: 'description', label: 'Expense Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount Spent' },
    { key: 'date', label: 'Date' },
  ];

  const expenseTransactions: Transaction[] = []; // Filter for expenses only
  const expenseCategories: Category[] = []; // Filter for expense categories only

  return (
    <div>
      <TransactionTable
        columns={expenseColumns}
        data={expenseTransactions}
        categories={expenseCategories}
        onAdd={transaction => {
          // Custom add logic for expenses
          console.log('Adding expense:', transaction);
        }}
        onEdit={(id, updates) => {
          // Custom edit logic
          console.log('Editing expense:', id, updates);
        }}
        onDelete={id => {
          // Custom delete logic
          console.log('Deleting expense:', id);
        }}
        allowAdd={true}
        allowEdit={true}
        allowDelete={true}
        emptyMessage="No expenses recorded yet"
      />
    </div>
  );
};

export { DashboardTransactions, TransactionModal, ExpenseOnlyTable };
