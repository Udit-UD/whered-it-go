import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { IndianRupee } from 'lucide-react';

interface BudgetOverviewProps {
  monthlyBudget: number;
  currentExpenses: number;
  currency?: string;
  className?: string;
  mode: string;
  onBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BudgetOverview({
  monthlyBudget,
  currentExpenses,
  currency = '₹',
  className,
  mode,
  onBudgetChange,
}: BudgetOverviewProps) {
  const remainingBudget = monthlyBudget - currentExpenses;
  const budgetPercentage = Math.min((currentExpenses / monthlyBudget) * 100, 100);
  const isOverBudget = currentExpenses > monthlyBudget;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Monthly Budget</p>
            <p className="text-foreground flex items-center gap-2 text-2xl font-bold">
              <IndianRupee size={16} />
              {mode === 'view' ? (
                monthlyBudget.toLocaleString()
              ) : (
                <Input
                  value={monthlyBudget}
                  onChange={onBudgetChange}
                  placeholder="Enter monthly budget"
                />
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Current Expenses</p>
            <p
              className={cn(
                'text-2xl font-bold',
                isOverBudget ? 'text-destructive' : 'text-foreground'
              )}
            >
              {currency}
              {currentExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Budget Used</span>
            <span
              className={cn(
                'text-sm font-medium',
                isOverBudget ? 'text-destructive' : 'text-foreground'
              )}
            >
              {budgetPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="bg-secondary h-2 w-full rounded-full">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                isOverBudget
                  ? 'bg-destructive'
                  : budgetPercentage > 80
                    ? 'bg-yellow-500'
                    : 'bg-primary'
              )}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="border-border border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Remaining</span>
            <span
              className={cn(
                'text-lg font-semibold',
                isOverBudget ? 'text-destructive' : 'text-green-500'
              )}
            >
              {isOverBudget ? '-' : ''}
              {currency}
              {Math.abs(remainingBudget).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
