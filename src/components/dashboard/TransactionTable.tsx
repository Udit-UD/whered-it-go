'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, EditIcon, SaveIcon, XIcon, TrashIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Transaction, Category } from '@/types';
import _ from 'lodash';
import { TRANSACTION_TYPES } from '@/constants';

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  width?: string;
}

interface EditingTransaction {
  id: string;
  description: string;
  amount: string;
  categoryId: string;
  date: Date;
  transactionType?: 'income' | 'expense' | 'transfer';
}

interface TransactionTableProps {
  columns: TableColumn[];
  data: Transaction[];
  categories: Category[];
  isLoading?: boolean;
  onAdd?: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit?: (id: string, transaction: Partial<Transaction>) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  emptyMessage?: string;
}

const TransactionTypeDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: 'income' | 'expense' | 'transfer') => void;
}) => {
  const onItemChange = (type: 'income' | 'expense' | 'transfer') => {
    onChange(type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'w-full'} size="sm">
          {value.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {_.map(TRANSACTION_TYPES, type => (
          <DropdownMenuItem key={type} onClick={() => onItemChange(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  columns,
  data,
  categories,
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
  showActions = true,
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  emptyMessage = 'No transactions found.',
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingData, setEditingData] = useState<EditingTransaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingData({
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      categoryId: transaction.categoryId,
      date: new Date(transaction.date),
    });
  };

  const handleSave = () => {
    if (!editingData) return;

    const category = categories.find(c => c.id === editingData.categoryId);
    if (!category) return;

    const amount = parseFloat(editingData.amount);
    const finalAmount =
      editingData.transactionType === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    if (editingId && onEdit) {
      // Update existing transaction
      onEdit(editingId, {
        description: editingData.description,
        amount: finalAmount,
        categoryId: editingData.categoryId,
        category: category,
        date: format(editingData.date, 'yyyy-MM-dd'),
        updatedAt: new Date().toISOString(),
      });
    } else if (onAdd) {
      // Add new transaction
      const newTransaction = {
        description: editingData.description,
        amount: finalAmount,
        categoryId: editingData.categoryId,
        category: category,
        transactionType: editingData.transactionType,
        date: format(editingData.date, 'yyyy-MM-dd'),
        userId: '1', // This should come from user context
      };
      onAdd(newTransaction);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditingData(null);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingData({
      id: '',
      description: '',
      amount: '',
      categoryId: categories[0]?.id || '',
      date: new Date(),
      transactionType: 'expense', // Default to expense
    });
  };

  const CategoryDropdown = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const selectedCategory = categories.find(c => c.id === value);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <span className="mr-2">{selectedCategory?.icon}</span>
            {selectedCategory?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {categories.map(category => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => onChange(category.id)}
              className="flex items-center"
            >
              <span className="mr-2">{category.icon}</span>
              <span>{category.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const DatePicker = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={date => {
              if (date) {
                onChange(date);
                setOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  const renderCellContent = (transaction: Transaction, column: TableColumn) => {
    const isEditing = editingId === transaction.id && editingData;
    switch (column.key) {
      case 'id':
        return <span className="font-mono text-sm">#{transaction.id.slice(-4)}</span>;

      case 'title':
      case 'description':
        return isEditing ? (
          <Input
            value={editingData.description}
            onChange={e => setEditingData({ ...editingData, description: e.target.value })}
          />
        ) : (
          transaction.description
        );

      case 'category':
        return isEditing ? (
          <CategoryDropdown
            value={editingData.categoryId}
            onChange={value => setEditingData({ ...editingData, categoryId: value })}
          />
        ) : (
          <div className="flex items-center">
            <span className="mr-2">{transaction.category.icon}</span>
            <span>{transaction.category.name}</span>
          </div>
        );

      case 'amount':
        return isEditing ? (
          <Input
            value={editingData.amount}
            placeholder="0"
            onChange={e => setEditingData({ ...editingData, amount: e.target.value })}
          />
        ) : (
          <span
            className={cn(
              'font-semibold',
              transaction.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
            )}
          >
            Rs. {Math.abs(transaction.amount).toFixed(2)}
          </span>
        );

      case 'date':
        return isEditing ? (
          <DatePicker
            value={editingData.date}
            onChange={date => setEditingData({ ...editingData, date })}
          />
        ) : (
          format(new Date(transaction.date), 'MMM dd, yyyy')
        );

      case 'transactionType':
        return isEditing ? (
          <TransactionTypeDropdown
            value={_.get(editingData, 'transactionType', 'expense')}
            onChange={type => setEditingData({ ...editingData, transactionType: type })}
          />
        ) : (
          <span className="capitalize">{transaction.transactionType}</span>
        );
      default:
        const value = transaction[column.key as keyof Transaction];
        if (typeof value === 'string' || typeof value === 'number') {
          return value || '-';
        }
        return '-';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="text-right" style={{ width: '100px' }}>
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="py-8 text-center"
              >
                <div className="flex items-center justify-center">
                  <Spinner className="mr-2" />
                  Loading transactions...
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={column.key}
                className={column.className}
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="text-right" style={{ width: '100px' }}>
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(transaction => (
            <TableRow key={transaction.id}>
              {columns.map(column => (
                <TableCell
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {renderCellContent(transaction, column)}
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="px-4 py-2 text-right" style={{ width: '100px' }}>
                  <div className="flex justify-end gap-2">
                    {editingId === transaction.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={!editingData?.description || !editingData?.amount}
                        >
                          <SaveIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {allowEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(transaction)}
                            disabled={isAdding || editingId !== null}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {allowDelete && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={isAdding || editingId !== null}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
          {isAdding && editingData && allowAdd && (
            <TableRow>
              <TableCell
                className="text-muted-foreground p-2"
                style={{ width: columns[0]?.width, minWidth: columns[0]?.width }}
              >
                New
              </TableCell>
              {columns.slice(1).map(column => (
                <TableCell
                  key={column.key}
                  className="p-2"
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {column.key === 'description' || column.key === 'title' ? (
                    <Input
                      value={editingData.description}
                      onChange={e =>
                        setEditingData({ ...editingData, description: e.target.value })
                      }
                      placeholder="Transaction description"
                    />
                  ) : column.key === 'category' ? (
                    <CategoryDropdown
                      value={editingData.categoryId}
                      onChange={value => setEditingData({ ...editingData, categoryId: value })}
                    />
                  ) : column.key === 'amount' ? (
                    <Input
                      value={editingData.amount}
                      onChange={e => setEditingData({ ...editingData, amount: e.target.value })}
                      placeholder="0"
                    />
                  ) : column.key === 'date' ? (
                    <DatePicker
                      value={editingData.date}
                      onChange={date => setEditingData({ ...editingData, date })}
                    />
                  ) : column.key === 'transactionType' ? (
                    <TransactionTypeDropdown
                      value={editingData.transactionType || 'expense'}
                      onChange={type => setEditingData({ ...editingData, transactionType: type })}
                    />
                  ) : null}
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="text-right" style={{ width: '100px' }}>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!editingData.description || !editingData.amount}
                    >
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          )}
          {data.length === 0 && !isAdding && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="text-muted-foreground py-8 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {allowAdd && data.length > 0 && !isAdding && !editingId && (
        <div className="border-t p-4">
          <Button onClick={handleAddNew} variant="outline" className="w-full">
            <span className="mr-2">+</span>
            Add New Transaction
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
