// API Response types
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Financial types
export interface Transaction {
  id: string
  amount: number
  description: string
  categoryId: string
  category: Category
  type: 'income' | 'expense' | 'transfer'
  date: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: 'income' | 'expense'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  categoryId: string
  category: Category
  period: 'monthly' | 'quarterly' | 'yearly'
  startDate: string
  endDate: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  budgetUtilization: number
  topCategories: {
    categoryId: string
    categoryName: string
    amount: number
    percentage: number
  }[]
}

// Form types
export interface TransactionFormData {
  amount: number
  description: string
  categoryId: string
  type: 'income' | 'expense'
  date: string
}

export interface BudgetFormData {
  name: string
  amount: number
  categoryId: string
  period: 'monthly' | 'quarterly' | 'yearly'
  startDate: string
}

export interface CategoryFormData {
  name: string
  color: string
  icon: string
  type: 'income' | 'expense'
}

// Common UI types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  external?: boolean
}

// Chart data types
export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  income: number
  expenses: number
  net: number
}
