import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface ExpenseCategoriesProps {
  categories: ExpenseCategory[];
  totalExpenses: number;
  currency?: string;
  className?: string;
}

export function ExpenseCategories({
  categories,
  totalExpenses,
  currency = '$',
  className,
}: ExpenseCategoriesProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Expense Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-foreground text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">
                    {currency}
                    {category.amount.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-xs">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="bg-secondary h-1.5 w-full rounded-full">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: category.color,
                    width: `${category.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No expenses recorded yet</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Start logging your expenses to see category breakdown
            </p>
          </div>
        )}

        {totalExpenses > 0 && (
          <div className="border-border border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Expenses</span>
              <span className="text-foreground text-lg font-semibold">
                {currency}
                {totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
