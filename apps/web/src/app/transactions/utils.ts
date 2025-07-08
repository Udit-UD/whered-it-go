import { TableColumn } from '@/components/dashboard';

const tableColumns: TableColumn[] = [
  { key: 'id', label: 'ID', className: 'px-4 py-2 w-20', width: '100px' },
  { key: 'description', label: 'Title', className: 'px-4 py-2 min-w-48', width: '200px' },
  { key: 'category', label: 'Category', className: 'px-4 py-2 w-40', width: '160px' },
  { key: 'date', label: 'Date', className: 'px-4 py-2 w-32', width: '120px' },
  { key: 'transactionType', label: 'Type', className: 'px-4 py-2 w-24', width: '96px' },
  { key: 'amount', label: 'Amount', className: 'px-4 py-2 w-32 ', width: '120px' },
];

export { tableColumns };
