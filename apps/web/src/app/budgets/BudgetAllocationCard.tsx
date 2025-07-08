import { Card, CardContent, CardHeader, CardTitle } from '@/components';
import { BudgetAllocationCardProps } from './types';

const BudgetAllocationCard = ({ title, value, icon, subtitle }: BudgetAllocationCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default BudgetAllocationCard;
