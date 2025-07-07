import { ReactNode } from 'react';

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      color: string;
      icon: string;
    };
  }>;
}

interface SummaryCardProps {
  title: string;
  value: number;
  previousValue: number;
  showValues: boolean;
  formatCurrency: (amount: number) => string;
  calculatePercentageChange: (
    current: number,
    previous: number
  ) => {
    value: string | number;
    isPositive: boolean;
  };
  icon: ReactNode;
  iconWrapperClasses: string;
  valueTextColor: string;
}

export type { TooltipPayload, CustomTooltipProps, PieTooltipProps, SummaryCardProps };
