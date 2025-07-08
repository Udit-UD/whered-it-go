import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SummaryCardProps } from './types';

export const SummaryCard = ({
  title,
  value,
  previousValue,
  showValues,
  formatCurrency,
  calculatePercentageChange,
  icon,
  iconWrapperClasses,
  valueTextColor,
}: SummaryCardProps) => {
  const change = calculatePercentageChange(value, previousValue);
  const ChangeIcon = change.isPositive ? TrendingUp : TrendingDown;
  const changeColor = change.isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${iconWrapperClasses}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueTextColor}`}>
          {showValues ? formatCurrency(value) : '••••'}
        </div>
        <p className={`flex items-center gap-1 text-xs ${changeColor}`}>
          <ChangeIcon className="h-3 w-3" />
          {change.value}% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
