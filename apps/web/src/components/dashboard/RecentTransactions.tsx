import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import withPreloader from '@/hocs/withPreloader';
import apiService from '@/lib/apiService';
import { cn } from '@/lib/utils';
import { ApiResponse, Transaction } from '@/types';
import _ from 'lodash';
import { useEffect, useState } from 'react';
interface RecentTransactionsProps {
  currency?: string;
  className?: string;
  preloadedData?: Record<string, unknown>;
  isLoading?: boolean;
}

type TransactionsResponse = ApiResponse<Transaction[]>;

function RecentTransactions({
  currency = '$',
  className,
  preloadedData,
  isLoading,
}: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isLoading) {
      const transactionResponse = preloadedData?.recentTransactions as TransactionsResponse;
      const trasactionData = transactionResponse?.data || [];
      setTransactions(trasactionData);
    }
  }, [isLoading, preloadedData]);

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
                key={transaction._id}
                className="bg-secondary/50 hover:bg-secondary flex items-center justify-between rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{_.get(transaction, 'category.icon', '')}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {transaction.description}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-muted-foreground text-xs">
                        {transaction.category.name}
                      </span>
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
                      transaction.transactionType === 'expense'
                        ? 'text-destructive'
                        : 'text-green-500'
                    )}
                  >
                    {transaction.transactionType === 'expense' ? '-' : '+'}
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

const config = {
  apiCalls: [
    {
      key: 'recentTransactions',
      fn: () =>
        apiService.get<ApiResponse<Transaction[]>>(
          '/transactions/recent-transactions?limit=5&page=1'
        ),
    },
  ],
};

export default withPreloader(RecentTransactions, config);
