# TransactionTable Component

A reu## TableColumn Interface

````typescript
interface TableColumn {
  key: string;        // Field name from Transaction object
  label: string;      // Display name for the column header
  className?: string; // Optional CSS classes for the column
  width?: string;     // Optional fixed width (e.g., '120px', '200px')
}
```ature-rich table component for displaying and managing transactions in the expense tracking application.

## Features

- **Display transactions** in a clean, professional table format
- **Loading state** with spinner when data is being fetched
- **Inline editing** of existing transactions
- **Add new transactions** directly from the table
- **Delete transactions** with confirmation
- **Category dropdown** with icons for easy selection
- **Date picker** for accurate date entry
- **Customizable columns** for different use cases
- **Responsive design** that works on all screen sizes
- **Sort transactions** by date (newest first)
- **Flexible permissions** to control what actions are allowed

## Props

| Prop           | Type            | Default                  | Description                                    |
| -------------- | --------------- | ------------------------ | ---------------------------------------------- |
| `columns`      | `TableColumn[]` | Required                 | Array of column definitions                    |
| `data`         | `Transaction[]` | Required                 | Array of transaction data to display           |
| `categories`   | `Category[]`    | Required                 | Array of available categories                  |
| `isLoading`    | `boolean`       | `false`                  | Shows loading spinner when true                |
| `onAdd`        | `function`      | Optional                 | Callback when adding new transaction           |
| `onEdit`       | `function`      | Optional                 | Callback when editing existing transaction     |
| `onDelete`     | `function`      | Optional                 | Callback when deleting transaction             |
| `showActions`  | `boolean`       | `true`                   | Whether to show action buttons column          |
| `allowAdd`     | `boolean`       | `true`                   | Whether to allow adding new transactions       |
| `allowEdit`    | `boolean`       | `true`                   | Whether to allow editing existing transactions |
| `allowDelete`  | `boolean`       | `true`                   | Whether to allow deleting transactions         |
| `emptyMessage` | `string`        | "No transactions found." | Message shown when no data                     |

## TableColumn Interface

```typescript
interface TableColumn {
  key: string; // Field name from Transaction object
  label: string; // Display name for the column header
  className?: string; // Optional CSS classes for the column
}
````

## Supported Column Keys

- `id` - Transaction ID (displays as #XXXX format)
- `description` or `title` - Transaction description
- `category` - Category with icon and name
- `amount` - Amount with color coding (green for income, red for expenses)
- `date` - Formatted date
- Any other field from the Transaction object

## Basic Usage

```tsx
import TransactionTable, { TableColumn } from '@/components/dashboard/TransactionTable';

const columns: TableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'description', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
];

function MyComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAdd = newTransaction => {
    // Add logic here
    setTransactions(prev => [...prev, { ...newTransaction, id: Date.now().toString() }]);
  };

  const handleEdit = (id, updates) => {
    // Edit logic here
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleDelete = id => {
    // Delete logic here
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionTable
      columns={columns}
      data={transactions}
      categories={categories}
      isLoading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

## Read-Only Usage

For dashboard widgets or modal displays where you don't want editing:

```tsx
<TransactionTable
  columns={[
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
  ]}
  data={recentTransactions}
  categories={categories}
  showActions={false}
  allowAdd={false}
  allowEdit={false}
  allowDelete={false}
  emptyMessage="No recent transactions"
/>
```

## Limited Functionality Usage

For specific use cases where you only want certain actions:

```tsx
<TransactionTable
  columns={columns}
  data={expenseTransactions}
  categories={expenseCategories}
  onAdd={handleAddExpense}
  allowAdd={true}
  allowEdit={false} // No editing
  allowDelete={false} // No deleting
  emptyMessage="No expenses recorded"
/>
```

## Loading State

The component automatically handles loading states:

```tsx
<TransactionTable
  columns={columns}
  data={transactions}
  categories={categories}
  isLoading={isLoadingData} // Shows spinner and loading message
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', className: 'w-20' },
  { key: 'description', label: 'Title', className: 'min-w-48' },
  { key: 'amount', label: 'Amount', className: 'text-right' },
];
```

## Integration with Forms

The component handles all form interactions internally:

- **Category selection**: Dropdown with icons
- **Date picking**: Calendar popup
- **Amount input**: Number input with proper validation
- **Description**: Text input with placeholder

## Data Flow

1. **Adding**: Component calls `onAdd` with new transaction data (without id, createdAt, updatedAt)
2. **Editing**: Component calls `onEdit` with transaction id and updated fields
3. **Deleting**: Component calls `onDelete` with transaction id

The parent component is responsible for updating the `data` prop with the new state.

## Dependencies

- React 18+
- Lucide React (for icons)
- date-fns (for date formatting)
- Radix UI components (for dropdowns, popovers, calendar)
- Tailwind CSS (for styling)

## Error Handling

The component includes basic validation:

- Description is required for saving
- Amount is required and must be a valid number
- Category must be selected from available options
- Date is required

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Focus management during editing
- Semantic HTML structure

## Responsive Design & Horizontal Scrolling

The TransactionTable component now includes built-in horizontal scrolling when the table content exceeds the container width. This ensures the table remains usable on all screen sizes.

### Width Configuration

You can set fixed widths for columns using the `width` property:

```tsx
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '80px', className: 'text-center' },
  { key: 'description', label: 'Title', width: '200px' },
  { key: 'category', label: 'Category', width: '160px' },
  { key: 'amount', label: 'Amount', width: '120px', className: 'text-right' },
  { key: 'date', label: 'Date', width: '120px' },
];
```

### Responsive Behavior

- **Desktop**: Table displays normally if it fits within the container
- **Tablet/Mobile**: Horizontal scroll bar appears when table is wider than container
- **Custom Scrollbar**: Styled scrollbars for better visual appeal
- **Touch Scrolling**: Smooth scrolling on touch devices

### Best Practices for Column Widths

- **ID Column**: 60-80px (short identifiers)
- **Description**: 200-300px (main content)
- **Category**: 140-160px (icon + name)
- **Amount**: 100-140px (numbers + currency)
- **Date**: 120-140px (formatted dates)
- **Actions**: 120-150px (edit/delete buttons)

```tsx
// Recommended mobile-friendly configuration
const mobileColumns: TableColumn[] = [
  { key: 'description', label: 'Title', width: '180px' },
  { key: 'amount', label: 'Amount', width: '100px', className: 'text-right' },
  { key: 'date', label: 'Date', width: '100px' },
];

// Recommended desktop configuration
const desktopColumns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'description', label: 'Title', width: '250px' },
  { key: 'category', label: 'Category', width: '160px' },
  { key: 'amount', label: 'Amount', width: '120px', className: 'text-right' },
  { key: 'date', label: 'Date', width: '120px' },
  { key: 'transactionType', label: 'Type', width: '100px' },
];
```

### Minimum Table Width

The table will have a minimum width equal to the sum of all column widths plus the actions column (if enabled). The horizontal scroll will activate when this minimum width exceeds the container width.
