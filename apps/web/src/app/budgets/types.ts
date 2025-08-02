import { Category } from '@/types';

export interface BudgetAllocationCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
}

export interface BudgetCategoryInput {
  categoryId: string;
  allocatedAmount: number;
  note?: string;
}

export interface BudgetCategory extends Category {
  allocatedAmount: number;
  spent: number;
}

export interface BudgetOverview {
  budgetId: string;
  totalAmount: number;
  allocatedCategories: BudgetCategory[];
}
