import React from 'react';
import { BudgetAllocation } from './types';
import { Button } from '@/components';
import { Edit2, Trash2 } from 'lucide-react';

const BarTile = ({
  budget,
  handleEditBudget,
  handleDeleteBudget,
}: {
  budget: BudgetAllocation;
  handleEditBudget: (budget: BudgetAllocation) => void;
  handleDeleteBudget: (id: string) => void;
}) => {
  const getProgressPercentage = (spent: number, allocated: number) => {
    return allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const progressPercentage = getProgressPercentage(budget.spent, budget.allocated);
  const progressColor = getProgressColor(progressPercentage);

  return (
    <div key={budget.id} className="bg-card rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
            style={{ backgroundColor: budget.categoryColor + '20' }}
          >
            {budget.categoryIcon}
          </div>
          <div>
            <h4 className="text-foreground font-medium">{budget.categoryName}</h4>
            <p className="text-muted-foreground text-sm capitalize">{budget.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEditBudget(budget)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDeleteBudget(budget.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {budget.spent.toLocaleString()} / {budget.allocated.toLocaleString()}
          </span>
          <span className="text-foreground font-medium">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="bg-muted h-2 w-full rounded-full">
          <div
            className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        {budget.spent > budget.allocated && (
          <p className="text-sm font-medium text-red-500">
            Over budget by {(budget.spent - budget.allocated).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default BarTile;
