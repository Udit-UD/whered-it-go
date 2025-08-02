'use client';

import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
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
import { cn, generateRandomId, getAmountColor } from '@/lib/utils';
import { Transaction, Category, TransactionType } from '@/types';
import { TRANSACTION_TYPES, USER_CURRENCY } from '@/constants';
import { MdDelete } from 'react-icons/md';

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
  transactionType?: TransactionType;
  isNew?: boolean;
  isModified?: boolean;
}

interface TransactionTableProps {
  columns: TableColumn[];
  data: Transaction[];
  categories: Category[];
  isLoading?: boolean;
  allowAdd?: boolean;
  emptyMessage?: string;
  isEditing?: boolean;
  onAddingNewRow: (isAddingNewRow: boolean) => void;
  onChangesUpdate?: (changes: EditingTransaction[]) => void;
  isAddingNewRow?: boolean;
  onRemoveTransaction: (id: string) => void;
}

const TransactionTypeDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: TransactionType) => void;
}) => {
  const onItemChange = (type: TransactionType) => {
    onChange(type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'w-full justify-start'} size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
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
        />
      </PopoverContent>
    </Popover>
  );
};

const CategoryDropdown = ({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}) => {
  const selectedCategory = categories.find(c => c._id === value);

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
            key={category._id}
            onClick={() => onChange(category._id)}
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

const DeleteCell = ({
  id,
  onDelete,
  icon,
}: {
  id: string;
  onDelete: (id: string) => void;
  icon: React.ReactNode;
}) => {
  return (
    <TableCell width={'30px'} className="px-0 py-2">
      <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="py-0">
        {icon}
      </Button>
    </TableCell>
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  columns,
  data,
  categories,
  isLoading = false,
  allowAdd = true,
  emptyMessage = 'No transactions found.',
  isEditing = false,
  onAddingNewRow,
  onChangesUpdate,
  isAddingNewRow,
  onRemoveTransaction,
}) => {
  const [editingTransactions, setEditingTransactions] = useState<
    Record<string, EditingTransaction>
  >({});
  const [newTransactions, setNewTransactions] = useState<EditingTransaction[]>([]);

  useEffect(() => {
    if (!isAddingNewRow) {
      setNewTransactions([]);
    }
  }, [isAddingNewRow]);

  const handleEdit = (transaction: Transaction) => {
    if (!isEditing) return;

    setEditingTransactions(prev => ({
      ...prev,
      [transaction._id]: {
        id: transaction._id,
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        categoryId: transaction.category?._id || '',
        date: new Date(transaction.date),
        transactionType: transaction.transactionType,
        isModified: false,
      },
    }));
  };

  const handleUpdateTransaction = (
    id: string,
    field: keyof EditingTransaction,
    value: string | Date | TransactionType
  ) => {
    setEditingTransactions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        isModified: true,
      },
    }));
  };

  const handleUpdateNewTransaction = (
    index: number,
    field: keyof EditingTransaction,
    value: string | Date | TransactionType
  ) => {
    setNewTransactions(prev => prev.map((tx, i) => (i === index ? { ...tx, [field]: value } : tx)));
  };

  const handleAddNew = () => {
    onAddingNewRow(true);

    setNewTransactions(prev => [
      ...prev,
      {
        id: generateRandomId(),
        description: '',
        amount: '',
        categoryId: categories[0]?._id || '',
        date: new Date(),
        transactionType: 'expense',
        isNew: true,
      },
    ]);
  };

  const onDelete = (id: string) => {
    setNewTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const renderCellContent = (transaction: Transaction, column: TableColumn, index: number) => {
    const editingData = editingTransactions[transaction._id];
    const isCurrentlyEditing = isEditing && editingData;

    switch (column.key) {
      case 'id':
        return <span className="font-mono text-sm">{index + 1}</span>;
      case 'title':
      case 'description':
        return isCurrentlyEditing ? (
          <Input
            value={editingData.description}
            onChange={e => handleUpdateTransaction(transaction._id, 'description', e.target.value)}
            onClick={() => !editingData && handleEdit(transaction)}
          />
        ) : (
          <div
            className={isEditing ? 'cursor-pointer rounded p-2 hover:bg-gray-100' : ''}
            onClick={() => isEditing && handleEdit(transaction)}
          >
            {transaction.description}
          </div>
        );

      case 'category':
        return isCurrentlyEditing ? (
          <CategoryDropdown
            value={editingData.categoryId}
            onChange={value => handleUpdateTransaction(transaction._id, 'categoryId', value)}
            categories={categories}
          />
        ) : (
          <div
            className={
              isEditing
                ? 'flex cursor-pointer items-center rounded p-2 hover:bg-gray-100'
                : 'flex items-center'
            }
            onClick={() => isEditing && handleEdit(transaction)}
          >
            <span className="mr-2">{transaction.category?.icon}</span>
            <span>{transaction.category?.name}</span>
          </div>
        );

      case 'amount':
        return isCurrentlyEditing ? (
          <Input
            value={editingData.amount}
            placeholder="0"
            onChange={e => handleUpdateTransaction(transaction._id, 'amount', e.target.value)}
          />
        ) : (
          <div
            className={isEditing ? 'cursor-pointer rounded p-2 hover:bg-gray-100' : ''}
            onClick={() => isEditing && handleEdit(transaction)}
          >
            <span className={cn('font-semibold', getAmountColor(transaction.transactionType))}>
              {USER_CURRENCY} {Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        );

      case 'date':
        return isCurrentlyEditing ? (
          <DatePicker
            value={editingData.date}
            onChange={date => handleUpdateTransaction(transaction._id, 'date', date)}
          />
        ) : (
          <div
            className={isEditing ? 'cursor-pointer rounded p-2 hover:bg-gray-100' : ''}
            onClick={() => isEditing && handleEdit(transaction)}
          >
            {format(new Date(transaction.date), 'MMM dd, yyyy')}
          </div>
        );

      case 'transactionType':
        return isCurrentlyEditing ? (
          <TransactionTypeDropdown
            value={editingData.transactionType || 'expense'}
            onChange={type => handleUpdateTransaction(transaction._id, 'transactionType', type)}
          />
        ) : (
          <div
            className={isEditing ? 'cursor-pointer rounded p-2 hover:bg-gray-100' : ''}
            onClick={() => isEditing && handleEdit(transaction)}
          >
            <span className="capitalize">{transaction.transactionType}</span>
          </div>
        );
      default:
        const value = transaction[column.key as keyof Transaction];
        if (typeof value === 'string' || typeof value === 'number') {
          return isEditing ? (
            <div
              className="cursor-pointer rounded p-2 hover:bg-gray-100"
              onClick={() => handleEdit(transaction)}
            >
              {value || '-'}
            </div>
          ) : (
            value || '-'
          );
        }
        return '-';
    }
  };

  const renderCellContentForNewTransaction = (
    newTransaction: EditingTransaction,
    column: TableColumn,
    index: number
  ) => {
    switch (column.key) {
      case 'id':
        return <span className="font-mono text-sm">{data.length + index + 1}</span>;
      case 'title':
      case 'description':
        return (
          <Input
            value={newTransaction.description}
            onChange={e => handleUpdateNewTransaction(index, 'description', e.target.value)}
            placeholder="Transaction description"
          />
        );
      case 'category':
        return (
          <CategoryDropdown
            value={newTransaction.categoryId}
            onChange={value => handleUpdateNewTransaction(index, 'categoryId', value)}
            categories={categories}
          />
        );
      case 'amount':
        return (
          <Input
            value={newTransaction.amount}
            onChange={e => handleUpdateNewTransaction(index, 'amount', e.target.value)}
            placeholder="0"
          />
        );
      case 'date':
        return (
          <DatePicker
            value={newTransaction.date}
            onChange={date => handleUpdateNewTransaction(index, 'date', date)}
          />
        );
      case 'transactionType':
        return (
          <TransactionTypeDropdown
            value={newTransaction.transactionType || 'expense'}
            onChange={type => handleUpdateNewTransaction(index, 'transactionType', type)}
          />
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    const modifiedTransactions = Object.values(editingTransactions).filter(tx => tx.isModified);
    const allChanges = [...modifiedTransactions, ...newTransactions];
    onChangesUpdate?.(allChanges);
  }, [editingTransactions, newTransactions, onChangesUpdate]);

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
              <TableHead className="text-right" style={{ width: '100px' }}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center">
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction, index) => (
            <TableRow key={transaction._id}>
              {_.map(columns, column => (
                <TableCell
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {renderCellContent(transaction, column, index)}
                </TableCell>
              ))}
              {DeleteCell({
                id: transaction._id,
                onDelete: onRemoveTransaction,
                icon: <MdDelete size={'16px'} />,
              })}
            </TableRow>
          ))}
          {newTransactions.map((newTransaction, index) => (
            <TableRow key={newTransaction.id}>
              <TableCell
                className={columns[0].className}
                style={{ width: columns[0]?.width, minWidth: columns[0]?.width }}
              >
                {data.length + index + 1}
              </TableCell>
              {columns.slice(1).map(column => (
                <TableCell
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width, minWidth: column.width }}
                >
                  {renderCellContentForNewTransaction(newTransaction, column, index)}
                </TableCell>
              ))}
              {DeleteCell({ id: newTransaction.id, onDelete, icon: <X size={'16px'} /> })}
            </TableRow>
          ))}
          {data.length === 0 && newTransactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground py-8 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {allowAdd && !isEditing && (
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
