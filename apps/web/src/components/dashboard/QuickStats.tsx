import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickStatsProps {
  stats: {
    totalTransactions: number;
    avgDailySpending: number;
    topCategory: { name: string; icon: string } | null;
    monthlyChange: number;
  };
  currency?: string;
  className?: string;
}

export function QuickStats({ stats, currency = '$', className }: QuickStatsProps) {
  const formatChange = (change: number) => {
    const isPositive = change >= 0;

    return {
      value: Math.abs(change),
      isPositive,
      sign: isPositive ? '+' : '-',
    };
  };

  const monthlyChange = formatChange(stats.monthlyChange);

  const statItems = [
    {
      label: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      suffix: '',
      icon: '📊',
    },
    {
      label: 'Avg Daily Spending',
      value: stats.avgDailySpending.toFixed(0),
      suffix: '',
      prefix: currency,
      icon: '📈',
    },
    {
      label: 'Top Category',
      value: stats.topCategory?.name || 'N/A',
      suffix: '',
      icon: stats.topCategory?.icon || '❓',
    },
    {
      label: 'vs Last Month',
      value: monthlyChange.value.toFixed(1),
      suffix: '%',
      prefix: monthlyChange.sign,
      icon: monthlyChange.isPositive ? '📈' : '📉',
      isChange: true,
      isPositive: monthlyChange.isPositive,
    },
  ];

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-muted-foreground text-xs font-medium">{item.label}</span>
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    'text-lg font-bold',
                    item.isChange
                      ? item.isPositive
                        ? 'text-red-500'
                        : 'text-green-500'
                      : 'text-foreground'
                  )}
                >
                  {item.prefix}
                  {item.value}
                  {item.suffix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
