import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTooltipProps, PieTooltipProps, TooltipPayload } from './types';

const CategoryType = ({
  mockCategoryData,
  showValues = true,
  mockSpendingBreakdown,
}: {
  mockCategoryData: {
    name: string;
    value: number;
    color: string;
    icon: React.ReactNode;
  }[];
  showValues?: boolean;
  mockSpendingBreakdown: {
    category: string;
    amount: number;
    color: string;
  }[];
}) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const PieTooltip = ({ active, payload }: PieTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card rounded-lg border p-3 shadow-lg">
          <p className="text-card-foreground flex items-center gap-2 font-medium">
            {data.payload.icon} {data.name}
          </p>
          <p className="text-primary text-lg font-semibold">{formatCurrency(data.value)}</p>
          <p className="text-muted-foreground text-sm">
            {(
              (data.value / mockCategoryData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card rounded-lg border p-3 shadow-lg">
          <p className="text-card-foreground mb-2 font-medium">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground text-sm">{entry.dataKey}:</span>
              <span className="text-sm font-semibold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Financial Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Distribution</CardTitle>
          <CardDescription>
            Breakdown of your financial allocations across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {mockCategoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground text-sm">{item.name}</span>
                <span className="ml-auto text-sm font-medium">
                  {showValues ? formatCurrency(item.value) : '••••'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of your spending across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockSpendingBreakdown}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#9ca3af"
                />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {mockSpendingBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryType;
