import { TrendingUp, TrendingDown, PiggyBank, DollarSign } from 'lucide-react';

const SummaryCardData = [
  {
    title: 'Total Spendings',
    key: 'spendings',
    icon: <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />,
    iconWrapperClasses: 'bg-red-100 dark:bg-red-900/20',
    valueTextColor: 'text-red-600 dark:text-red-400',
  },
  {
    title: 'Investments',
    key: 'investments',
    icon: <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />,
    iconWrapperClasses: 'bg-green-100 dark:bg-green-900/20',
    valueTextColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Savings',
    key: 'savings',
    icon: <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
    iconWrapperClasses: 'bg-blue-100 dark:bg-blue-900/20',
    valueTextColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Net Balance',
    key: 'netBalance',
    icon: <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
    iconWrapperClasses: 'bg-purple-100 dark:bg-purple-900/20',
    valueTextColor: 'text-purple-600 dark:text-purple-400',
  },
];

export default SummaryCardData;
