'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BudgetCategoryInput } from './types';
import { Category } from '@/types';

interface BudgetStepTwoProps {
  totalAmount: number;
  categories: Category[];
  onComplete: (allocations: BudgetCategoryInput[]) => void;
  onBack: () => void;
  initialAllocations: BudgetCategoryInput[];
}

const initialInputState: BudgetCategoryInput = {
  categoryId: '',
  allocatedAmount: 0,
  note: '',
};

export default function BudgetStepTwo({
  totalAmount,
  categories,
  onComplete,
  onBack,
  initialAllocations,
}: BudgetStepTwoProps) {
  const [allocations, setAllocations] = useState<BudgetCategoryInput[]>(initialAllocations);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategoryInput>(initialInputState);

  const allocationsAdded = allocations.length > 0;
  const totalAllocated = allocations.reduce(
    (sum, allocation) => sum + allocation.allocatedAmount,
    0
  );
  const remainingAmount = totalAmount - totalAllocated;

  const handleAddAllocation = () => {
    if (!selectedCategory.categoryId || selectedCategory.allocatedAmount <= 0) return;

    const category = categories.find(cat => cat._id === selectedCategory.categoryId);
    if (!category) return;

    const newAllocation: BudgetCategoryInput = {
      categoryId: category._id,
      allocatedAmount: selectedCategory.allocatedAmount,
      note: selectedCategory.note || '',
    };

    setAllocations(prev => [...prev, newAllocation]);
    setSelectedCategory(initialInputState);
  };

  const handleRemoveAllocation = (categoryId: string) => {
    setAllocations(prev => prev.filter(allocation => allocation.categoryId !== categoryId));
  };

  const handleUpdateAllocation = (categoryId: string, newAmount: number) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.categoryId === categoryId
          ? { ...allocation, allocatedAmount: newAmount }
          : allocation
      )
    );
  };

  const availableCategories = categories.filter(
    category => !allocations.some(allocation => allocation.categoryId === category._id)
  );

  const handleComplete = () => {
    onComplete(allocations);
  };

  const updateSelectedCategory = (key: keyof BudgetCategoryInput, value: string | number) => {
    setSelectedCategory(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to get category details by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat._id === categoryId);
  };

  return (
    <div className="space-y-6" style={allocationsAdded ? { width: '75vw' } : {}}>
      {/* Main Content Layout */}
      <div className={`flex gap-6 ${allocationsAdded ? 'flex-row' : 'flex-col'}`}>
        {/* Left Side - Budget Summary and Add Allocation */}
        <div className={`space-y-4 ${allocationsAdded ? 'flex-1' : 'w-full'}`}>
          {/* Budget Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Budget:</span>
                <span className="font-semibold">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Allocated:</span>
                <span className="font-semibold">Rs. {totalAllocated.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining:</span>
                <span
                  className={`font-semibold ${remainingAmount < 0 ? 'text-red-500' : 'text-green-600'}`}
                >
                  Rs. {remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Add New Allocation */}
          {availableCategories.length > 0 && (
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">Add Category Allocation</h3>

              <div className="space-y-3">
                {/* Category Selection */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedCategory.categoryId
                          ? (() => {
                              const cat = getCategoryById(selectedCategory.categoryId);
                              return (
                                <span className="flex items-center gap-2">
                                  <span>{cat?.icon}</span>
                                  <span>{cat?.name}</span>
                                </span>
                              );
                            })()
                          : 'Select category'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {availableCategories.map(category => (
                        <DropdownMenuItem
                          key={category._id}
                          onClick={() => updateSelectedCategory('categoryId', category._id)}
                          className="flex items-center gap-2"
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Amount Input and Add Button */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">Amount</label>
                    <Input
                      value={selectedCategory.allocatedAmount || ''}
                      onChange={e =>
                        updateSelectedCategory('allocatedAmount', Number(e.target.value))
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddAllocation}
                      disabled={
                        !selectedCategory.categoryId ||
                        selectedCategory.allocatedAmount <= 0 ||
                        selectedCategory.allocatedAmount > remainingAmount
                      }
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Current Allocations */}
        {allocationsAdded && (
          <div className="flex-1 space-y-3">
            <h3 className="font-medium">Current Allocations</h3>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {allocations.map(allocation => {
                const category = getCategoryById(allocation.categoryId);
                return (
                  <div
                    key={allocation.categoryId}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category?.icon}</span>
                      <div>
                        <p className="font-medium">{category?.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {((allocation.allocatedAmount / totalAmount) * 100).toFixed(1)}% of budget
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={allocation.allocatedAmount}
                        onChange={e =>
                          handleUpdateAllocation(allocation.categoryId, Number(e.target.value))
                        }
                        className="w-24"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAllocation(allocation.categoryId)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 border-t pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="flex flex-1 items-center justify-center gap-2"
          disabled={allocations.length === 0}
        >
          <Check className="h-4 w-4" />
          Create Budget
        </Button>
      </div>
    </div>
  );
}
