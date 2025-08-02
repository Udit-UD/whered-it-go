'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Target, PieChart as PieChartIcon, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BudgetAllocationCard from './BudgetAllocationCard';
import { BudgetAllocation } from './types';
import BarTile from './BarTile';
import PieChartDistribution from './PieChartDistribution';
import BudgetCreationModal, { CategoryAllocation } from './BudgetCreationModal';

// Mock data - replace with actual API calls
const mockCategories = [
  { id: '1', name: 'Food & Dining', color: '#ff6b6b', icon: '🍽️' },
  { id: '2', name: 'Transportation', color: '#4ecdc4', icon: '🚗' },
  { id: '3', name: 'Shopping', color: '#45b7d1', icon: '🛍️' },
  { id: '4', name: 'Entertainment', color: '#96ceb4', icon: '🎬' },
  { id: '5', name: 'Bills & Utilities', color: '#ffeaa7', icon: '⚡' },
  { id: '6', name: 'Healthcare', color: '#fd79a8', icon: '🏥' },
  { id: '7', name: 'Education', color: '#6c5ce7', icon: '📚' },
  { id: '8', name: 'Savings', color: '#00b894', icon: '💰' },
];

export default function BudgetPage() {
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetAllocation | null>(null);

  // Budget configuration states
  const [isBudgetConfigured, setIsBudgetConfigured] = useState(false); // Will be replaced with API call
  const [totalBudget, setTotalBudget] = useState(0);
  const [budgetNote, setBudgetNote] = useState('');
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false);

  // Mock initial data
  useEffect(() => {
    // TODO: Replace with API call to check if budget exists for current month
    const mockBudgetExists = false; // Change this to true to simulate existing budget

    if (mockBudgetExists) {
      setIsBudgetConfigured(true);
      setTotalBudget(80000);
      setBudgetNote('Monthly budget for essential expenses');

      const mockBudgetsInINR: BudgetAllocation[] = [
        {
          id: '1',
          categoryId: '1',
          categoryName: 'Food & Dining',
          categoryColor: '#ff6b6b',
          categoryIcon: '🍽️',
          allocated: 25000,
          spent: 22000,
          period: 'monthly',
        },
        {
          id: '2',
          categoryId: '2',
          categoryName: 'Transportation',
          categoryColor: '#4ecdc4',
          categoryIcon: '🚗',
          allocated: 10000,
          spent: 9500,
          period: 'monthly',
        },
        {
          id: '3',
          categoryId: '3',
          categoryName: 'Shopping',
          categoryColor: '#45b7d1',
          categoryIcon: '🛍️',
          allocated: 15000,
          spent: 15500, // slight overspend
          period: 'monthly',
        },
        {
          id: '4',
          categoryId: '4',
          categoryName: 'Entertainment',
          categoryColor: '#96ceb4',
          categoryIcon: '🎬',
          allocated: 8000,
          spent: 6000,
          period: 'monthly',
        },
        {
          id: '5',
          categoryId: '5',
          categoryName: 'Bills & Utilities',
          categoryColor: '#ffeaa7',
          categoryIcon: '⚡',
          allocated: 22000,
          spent: 22500, // slight overspend
          period: 'monthly',
        },
      ];

      setBudgetAllocations(mockBudgetsInINR);
    } else {
      setIsBudgetConfigured(false);
      setTotalBudget(0);
      setBudgetNote('');
      setBudgetAllocations([]);
    }
  }, []);

  const handleBudgetCreated = (budgetData: {
    totalAmount: number;
    note?: string;
    allocations: CategoryAllocation[];
  }) => {
    // TODO: Replace with API call to create budget
    setTotalBudget(budgetData.totalAmount);
    setBudgetNote(budgetData.note || '');
    setIsBudgetConfigured(true);

    // Convert CategoryAllocation to BudgetAllocation
    const newBudgetAllocations: BudgetAllocation[] = budgetData.allocations.map(allocation => ({
      id: Date.now().toString() + allocation.categoryId,
      categoryId: allocation.categoryId,
      categoryName: allocation.categoryName,
      categoryColor: allocation.categoryColor,
      categoryIcon: allocation.categoryIcon,
      allocated: allocation.allocated,
      spent: 0, // Initial spent amount
      period: 'monthly' as const,
    }));

    setBudgetAllocations(newBudgetAllocations);
  };

  const totalAllocated = budgetAllocations.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetAllocations.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalAllocated;

  const pieChartData = budgetAllocations.map(budget => ({
    name: budget.categoryName,
    value: budget.allocated,
    color: budget.categoryColor,
    icon: budget.categoryIcon,
  }));

  const handleEditBudget = (budget: BudgetAllocation) => {
    setEditingBudget(budget);
    setIsAddModalOpen(true);
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgetAllocations(prev => prev.filter(budget => budget.id !== budgetId));
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
      {!isBudgetConfigured ? (
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
              value={`Rs. ${totalBudget.toLocaleString()}`}
              subtitle="Monthly budget limit"
              icon={<IndianRupee className="text-muted-foreground h-4 w-4" />}
            />
            <BudgetAllocationCard
              title={'Allocated'}
              value={totalAllocated.toLocaleString()}
              subtitle={`${((totalAllocated / totalBudget) * 100).toFixed(1)}% of total budget`}
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
                  {budgetAllocations.map(budget => {
                    return (
                      <BarTile
                        key={budget.id}
                        budget={budget}
                        handleDeleteBudget={handleDeleteBudget}
                        handleEditBudget={handleEditBudget}
                      />
                    );
                  })}

                  {budgetAllocations.length === 0 && (
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
            <PieChartDistribution pieChartData={pieChartData} CustomTooltip={CustomTooltip} />
          </div>
        </>
      )}

      {/* Budget Creation Modal */}
      <BudgetCreationModal
        isOpen={isCreateBudgetModalOpen}
        onClose={() => setIsCreateBudgetModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
        categories={mockCategories}
      />
    </div>
  );
}
