import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  currency?: string;
  className?: string;
}

export function RecentTransactions({
  transactions,
  currency = '$',
  className,
}: RecentTransactionsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Food: '🍽️',
      Transportation: '🚗',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Bills: '📄',
      Health: '🏥',
      Education: '📚',
      Income: '💰',
      Other: '📝',
    };
    return icons[category] || icons['Other'];
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div
                key={transaction.id}
                className="bg-secondary/50 hover:bg-secondary flex items-center justify-between rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{getCategoryIcon(transaction.category)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {transaction.description}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-muted-foreground text-xs">{transaction.category}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      transaction.type === 'expense' ? 'text-destructive' : 'text-green-500'
                    )}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}
                    {currency}
                    {transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">No transactions yet</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Your recent transactions will appear here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
