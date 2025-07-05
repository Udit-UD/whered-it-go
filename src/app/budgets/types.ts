export interface BudgetAllocationCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
}

export interface BudgetAllocation {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  allocated: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}
