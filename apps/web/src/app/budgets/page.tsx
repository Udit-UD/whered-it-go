'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Target, PieChart as PieChartIcon, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BudgetAllocationCard from './BudgetAllocationCard';
import { BudgetAllocation } from './types';
import BarTile from './BarTile';
import PieChartDistribution from './PieChartDistribution';

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
  const [formData, setFormData] = useState<{
    categoryId: string;
    allocated: number;
    period: 'monthly' | 'quarterly' | 'yearly';
  }>({
    categoryId: '',
    allocated: 0,
    period: 'monthly',
  });
  const totalBudget = 80000;

  // Mock initial data
  useEffect(() => {
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
  }, []);

  const totalAllocated = budgetAllocations.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgetAllocations.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalAllocated;

  const pieChartData = budgetAllocations.map(budget => ({
    name: budget.categoryName,
    value: budget.allocated,
    color: budget.categoryColor,
    icon: budget.categoryIcon,
  }));

  const handleAddBudget = () => {
    if (formData.categoryId && formData.allocated > 0) {
      const selectedCategory = mockCategories.find(cat => cat.id === formData.categoryId);
      if (selectedCategory) {
        const newBudget: BudgetAllocation = {
          id: Date.now().toString(),
          categoryId: formData.categoryId,
          categoryName: selectedCategory.name,
          categoryColor: selectedCategory.color,
          categoryIcon: selectedCategory.icon,
          allocated: formData.allocated,
          spent: 0,
          period: formData.period,
        };
        setBudgetAllocations([...budgetAllocations, newBudget]);
        setFormData({ categoryId: '', allocated: 0, period: 'monthly' });
        setIsAddModalOpen(false);
      }
    }
  };

  const handleEditBudget = (budget: BudgetAllocation) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      allocated: budget.allocated,
      period: budget.period,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateBudget = () => {
    if (editingBudget && formData.allocated > 0) {
      setBudgetAllocations(prev =>
        prev.map(budget =>
          budget.id === editingBudget.id
            ? { ...budget, allocated: formData.allocated, period: formData.period }
            : budget
        )
      );
      setEditingBudget(null);
      setFormData({ categoryId: '', allocated: 0, period: 'monthly' });
      setIsAddModalOpen(false);
    }
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
          <h1 className="text-foreground text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground mt-1">
            Allocate and track your monthly budget across different categories
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget Allocation' : 'Add Budget Allocation'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget
                  ? 'Update the budget allocation for this category'
                  : 'Set a budget limit for a category to track your spending'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!editingBudget && (
                <div>
                  <label className="text-foreground text-sm font-medium">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="border-input bg-background text-foreground mt-1 w-full rounded-md border p-2"
                  >
                    <option value="">Select a category</option>
                    {mockCategories
                      .filter(
                        cat => !budgetAllocations.some(budget => budget.categoryId === cat.id)
                      )
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-foreground text-sm font-medium">Budget Amount</label>
                <Input
                  type="number"
                  value={formData.allocated}
                  onChange={e => setFormData({ ...formData, allocated: Number(e.target.value) })}
                  placeholder="Enter budget amount"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-foreground text-sm font-medium">Period</label>
                <select
                  value={formData.period}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      period: e.target.value as 'monthly' | 'quarterly' | 'yearly',
                    })
                  }
                  className="border-input bg-background text-foreground mt-1 w-full rounded-md border p-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={editingBudget ? handleUpdateBudget : handleAddBudget}
                  className="flex-1"
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingBudget(null);
                    setFormData({ categoryId: '', allocated: 0, period: 'monthly' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
    </div>
  );
}
