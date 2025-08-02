'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Target, PieChart as PieChartIcon, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BudgetAllocationCard from './BudgetAllocationCard';
import { BudgetCategory, BudgetOverview } from './types';
import BarTile from './BarTile';
import PieChartDistribution from './PieChartDistribution';
import BudgetCreationModal from './BudgetCreationModal';
import apiService from '@/lib/apiService';
import { toast } from 'sonner';
import _ from 'lodash';
import withPreloader from '@/hocs/withPreloader';
import { ApiResponse, Category } from '@/types';
import { getRandomColor } from '@/lib/utils';

type CreateBudgetResponse = {
  success: boolean;
  message: string;
  data: {
    budgetId: string;
    budgetCategories: [any];
  };
};

type UserBudgetOverviewResponse = ApiResponse<BudgetOverview>;
type CategoriesResponse = ApiResponse<Category[]>;

function BudgetPage({
  preloadedData,
  isLoading,
}: {
  preloadedData?: Record<string, unknown>;
  isLoading: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);

  // Budget configuration states
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null);
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const userBudgetOverviewResponse =
        preloadedData?.budgetOverview as UserBudgetOverviewResponse;
      const categoriesResponse = preloadedData?.categories as CategoriesResponse;
      console.log({ userBudgetOverviewResponse });
      const categoriesList = _.get(categoriesResponse, 'data', []);
      const userBudgetData = _.get(userBudgetOverviewResponse, 'data', null);

      setCategories(categoriesList);
      setBudgetOverview(userBudgetData);
    }
  }, [isLoading, preloadedData]);

  const createBudget = async (params: any) => {
    try {
      const response = await apiService.post<CreateBudgetResponse>(
        '/budget/create-budget-with-categories',
        params
      );
      if (response.success) {
        toast.success('Budget created successfully!');
        return true;
      }
    } catch (error) {
      toast.error('Failed to create budget');
      console.error('Failed to create budget:', error);
    }
  };

  const handleBudgetCreated = async (budgetData: {
    totalAmount: number;
    note?: string;
    allocations: { categoryId: string; allocatedAmount: number; note?: string }[];
  }) => {
    const input = {
      totalAmount: budgetData.totalAmount,
      note: budgetData.note,
      allocations: _.map(budgetData.allocations, allocation => ({
        categoryId: allocation.categoryId,
        allocatedAmount: allocation.allocatedAmount,
        note: '',
      })),
    };

    const budget = await createBudget(input);
    if (budget) {
      // TODO: refetch budget query
      setIsCreateBudgetModalOpen(false);
    }
  };

  const totalAllocated = _.reduce(
    budgetOverview?.allocatedCategories,
    (sum, category) => sum + category.allocatedAmount,
    0
  );

  const totalSpent = _.reduce(
    budgetOverview?.allocatedCategories,
    (sum, category) => sum + category.spent,
    0
  );

  const remainingBudget = _.get(budgetOverview, 'totalAmount', 0) - totalAllocated;

  const pieChartData = _.map(budgetOverview?.allocatedCategories, category => ({
    name: category.name,
    value: category.allocatedAmount,
    color: getRandomColor(),
    icon: category.icon,
  }));

  const handleEditBudget = (budget: BudgetCategory) => {
    setEditingBudget(budget);
    setIsAddModalOpen(true);
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };

  interface TooltipProps {
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

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card rounded-lg border p-3 shadow-lg">
          <p className="text-card-foreground font-medium">
            {data.payload.icon} {data.name}
          </p>
          <p className="text-primary font-semibold">Rs. {data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto w-3/4 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground text-sm">
            Allocate and track your monthly budget across different categories
          </p>
        </div>
      </div>

      {/* Conditional content based on budget configuration */}
      {!_.get(budgetOverview, 'budgetId', null) ? (
        // Budget not configured view
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-6 text-center">
            <div className="bg-muted mx-auto flex h-24 w-24 items-center justify-center rounded-full">
              <IndianRupee className="text-muted-foreground h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-xl font-semibold">
                No Budget Set for This Month
              </h2>
              <p className="text-muted-foreground mx-auto max-w-md text-base">
                Start managing your finances by creating a budget for this month. Set your total
                budget and allocate amounts to different spending categories.
              </p>
            </div>
            <Button onClick={() => setIsCreateBudgetModalOpen(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create {getCurrentMonth()} Budget
            </Button>
          </div>
        </div>
      ) : (
        // Budget configured view
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <BudgetAllocationCard
              title={'Total Budget'}
              value={`Rs. ${_.get(budgetOverview, 'totalAmount', 0).toLocaleString()}`}
              subtitle="Monthly budget limit"
              icon={<IndianRupee className="text-muted-foreground h-4 w-4" />}
            />
            <BudgetAllocationCard
              title={'Allocated'}
              value={`Rs. ${totalAllocated.toLocaleString()}`}
              subtitle={`${((totalAllocated / _.get(budgetOverview, 'totalBudget', 0)) * 100).toFixed(1)}% of total budget`}
              icon={<Target className="text-muted-foreground h-4 w-4" />}
            />
            <BudgetAllocationCard
              title={'Spent'}
              value={totalSpent.toLocaleString()}
              subtitle={`${((totalSpent / totalAllocated) * 100).toFixed(1)}% of allocated`}
              icon={<PieChartIcon className="text-muted-foreground h-4 w-4" />}
            />
            <BudgetAllocationCard
              title={'Remaining'}
              value={remainingBudget.toLocaleString()}
              subtitle={remainingBudget < 0 ? 'Over budget' : 'Available to allocate'}
              icon={<IndianRupee className="text-muted-foreground h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Budget Allocations List */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocations</CardTitle>
                <CardDescription>
                  Track your spending against allocated budgets for each category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetOverview?.allocatedCategories.map(category => {
                    return (
                      <BarTile
                        key={category._id}
                        category={category}
                        handleEditBudget={handleEditBudget}
                      />
                    );
                  })}

                  {budgetOverview?.allocatedCategories.length === 0 && (
                    <div className="py-8 text-center">
                      <PieChartIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      <h3 className="text-foreground mb-2 text-lg font-medium">
                        No budget allocations yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding budget allocations for your spending categories
                      </p>
                      <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Budget
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            {budgetOverview ? (
              <PieChartDistribution pieChartData={pieChartData} CustomTooltip={CustomTooltip} />
            ) : null}
          </div>
        </>
      )}

      {/* Budget Creation Modal */}
      <BudgetCreationModal
        isOpen={isCreateBudgetModalOpen}
        onClose={() => setIsCreateBudgetModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
        categories={categories}
      />
    </div>
  );
}

const config = {
  apiCalls: [
    {
      key: 'budgetOverview',
      fn: () => apiService.get<UserBudgetOverviewResponse>('/budget'),
    },
    {
      key: 'categories',
      fn: () => apiService.get<CategoriesResponse>('/categories'),
    },
  ],
};

export default withPreloader(BudgetPage, config);
