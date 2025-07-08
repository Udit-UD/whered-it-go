'use client';

import React, { useState } from 'react';
import { TrendingUp, PiggyBank, BarChart3, Filter, Download, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SummaryCard from './SummaryCard';
import _ from 'lodash';
import SummaryCardData from './constants';
import CategoryType from './CategoryType';
import TrendsType from './TrendsType';
import { Footer } from '../components';

// Mock data for demonstration
const mockSummaryData = {
  spendings: 3200,
  investments: 1500,
  savings: 2800,
  netBalance: 15600,
  previousMonth: {
    spendings: 2950,
    investments: 1200,
    savings: 2600,
    netBalance: 14800,
  },
};

const mockCategoryData = [
  { name: 'Spendings', value: 3200, color: '#ef4444', icon: '💸' },
  { name: 'Investments', value: 1500, color: '#22c55e', icon: '📈' },
  { name: 'Savings', value: 2800, color: '#3b82f6', icon: '💰' },
  { name: 'Other Necessities', value: 800, color: '#f59e0b', icon: '🏠' },
];

const mockTrendData = [
  {
    month: 'Jan',
    spendings: 2800,
    investments: 1200,
    savings: 2400,
    netBalance: 12000,
  },
  {
    month: 'Feb',
    spendings: 2950,
    investments: 1350,
    savings: 2500,
    netBalance: 13200,
  },
  {
    month: 'Mar',
    spendings: 3100,
    investments: 1400,
    savings: 2600,
    netBalance: 14100,
  },
  {
    month: 'Apr',
    spendings: 2850,
    investments: 1300,
    savings: 2700,
    netBalance: 14600,
  },
  {
    month: 'May',
    spendings: 2950,
    investments: 1200,
    savings: 2600,
    netBalance: 14800,
  },
  {
    month: 'Jun',
    spendings: 3200,
    investments: 1500,
    savings: 2800,
    netBalance: 15600,
  },
];

const mockSpendingBreakdown = [
  { category: 'Food & Dining', amount: 800, color: '#ef4444' },
  { category: 'Transportation', amount: 450, color: '#f97316' },
  { category: 'Shopping', amount: 600, color: '#eab308' },
  { category: 'Entertainment', amount: 350, color: '#84cc16' },
  { category: 'Bills & Utilities', amount: 520, color: '#06b6d4' },
  { category: 'Healthcare', amount: 280, color: '#8b5cf6' },
  { category: 'Others', amount: 200, color: '#ec4899' },
];

type TimeFrame = 'month' | 'quarter' | 'year';
type ViewType = 'category' | 'trends';

export default function ReportsPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [viewType, setViewType] = useState<ViewType>('category');
  const [showValues, setShowValues] = useState(true);

  const calculatePercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
    };
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto w-3/4 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of your financial performance and trends
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
            <Button
              variant={viewType === 'category' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('category')}
              className="h-8"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              Categories
            </Button>
            <Button
              variant={viewType === 'trends' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('trends')}
              className="h-8"
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Trends
            </Button>
          </div>

          {/* Time Frame Filter */}
          <select
            value={timeFrame}
            onChange={e => setTimeFrame(e.target.value as TimeFrame)}
            className="border-input bg-background text-foreground rounded-md border px-3 py-2 text-sm"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* Additional Controls */}
          <Button variant="outline" size="sm" onClick={() => setShowValues(!showValues)}>
            {showValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Spendings */}
        {_.map(SummaryCardData, item => (
          <SummaryCard
            key={item.key}
            title={item.title}
            value={mockSummaryData[item.key]}
            previousValue={mockSummaryData.previousMonth[item.key]}
            showValues={showValues}
            formatCurrency={formatCurrency}
            calculatePercentageChange={calculatePercentageChange}
            icon={item.icon}
            iconWrapperClasses={item.iconWrapperClasses}
            valueTextColor={item.valueTextColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      {viewType === 'category' ? (
        <CategoryType
          mockCategoryData={mockCategoryData}
          showValues={showValues}
          mockSpendingBreakdown={mockSpendingBreakdown}
        />
      ) : (
        <TrendsType mockTrendData={mockTrendData} />
      )}

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>Key takeaways from your financial data this {timeFrame}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/10">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-400">
                  Positive Growth
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your investments have grown by 25% this month, showing excellent portfolio
                performance.
              </p>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/10">
              <div className="mb-2 flex items-center gap-2">
                <Filter className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-400">
                  Spending Alert
                </span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Food & Dining expenses are 15% higher than usual. Consider reviewing your dining
                habits.
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
              <div className="mb-2 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-400">Savings Goal</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You&apos;re on track to meet your savings goal! Keep up the excellent progress.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Footer />
    </div>
  );
}
