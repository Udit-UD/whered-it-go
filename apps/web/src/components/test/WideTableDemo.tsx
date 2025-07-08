// Demo component to test table width and horizontal scrolling
import React from 'react';
import TransactionTable, { TableColumn } from '@/components/dashboard/TransactionTable';
import { Transaction, Category } from '@/types';

const WideTableDemo = () => {
  // Extended columns to test horizontal scrolling
  const wideColumns: TableColumn[] = [
    { key: 'id', label: 'ID', className: 'p-2 text-center', width: '80px' },
    { key: 'description', label: 'Transaction Description', className: 'p-2', width: '250px' },
    { key: 'category', label: 'Category', className: 'p-2', width: '160px' },
    { key: 'amount', label: 'Amount (Rs.)', className: 'p-2 text-right', width: '140px' },
    { key: 'date', label: 'Transaction Date', className: 'p-2', width: '150px' },
    { key: 'transactionType', label: 'Type', className: 'p-2 text-center', width: '100px' },
    { key: 'userId', label: 'User ID', className: 'p-2 text-center', width: '100px' },
    { key: 'createdAt', label: 'Created At', className: 'p-2', width: '150px' },
    { key: 'updatedAt', label: 'Updated At', className: 'p-2', width: '150px' },
  ];

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
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: -45.5,
      description: 'Lunch at Pizza Place with a very long description that should test wrapping',
      categoryId: '1',
      category: mockCategories[0],
      date: '2025-07-01',
      userId: '1',
      transactionType: 'expense',
      createdAt: '2025-07-01T10:30:00Z',
      updatedAt: '2025-07-01T10:30:00Z',
    },
    {
      id: '2',
      amount: 3000.0,
      description: 'Monthly Salary Payment',
      categoryId: '2',
      category: mockCategories[1],
      date: '2025-07-01',
      userId: '1',
      transactionType: 'income',
      createdAt: '2025-07-01T09:00:00Z',
      updatedAt: '2025-07-01T09:00:00Z',
    },
  ];

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">Wide Table Demo</h2>
      <p className="text-muted-foreground">
        This table has many columns to demonstrate horizontal scrolling when the content exceeds the
        container width.
      </p>

      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
        <h3 className="mb-4 text-lg font-semibold">Fixed Width Container (800px)</h3>
        <div style={{ width: '800px', border: '1px solid #ccc' }}>
          <TransactionTable
            columns={wideColumns}
            data={mockTransactions}
            categories={mockCategories}
            showActions={true}
            allowAdd={false}
            allowEdit={false}
            allowDelete={false}
            emptyMessage="No data to display"
          />
        </div>
      </div>

      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
        <h3 className="mb-4 text-lg font-semibold">Mobile Width Container (400px)</h3>
        <div style={{ width: '400px', border: '1px solid #ccc' }}>
          <TransactionTable
            columns={wideColumns}
            data={mockTransactions}
            categories={mockCategories}
            showActions={true}
            allowAdd={false}
            allowEdit={false}
            allowDelete={false}
            emptyMessage="No data to display"
          />
        </div>
      </div>

      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
        <h3 className="mb-4 text-lg font-semibold">Full Width Container</h3>
        <TransactionTable
          columns={wideColumns}
          data={mockTransactions}
          categories={mockCategories}
          showActions={true}
          allowAdd={true}
          allowEdit={true}
          allowDelete={true}
          emptyMessage="No data to display"
        />
      </div>
    </div>
  );
};

export default WideTableDemo;
