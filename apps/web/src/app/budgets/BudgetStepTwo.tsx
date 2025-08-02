'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Trash2 } from 'lucide-react';
import { CategoryAllocation } from './BudgetCreationModal';

interface BudgetStepTwoProps {
  totalAmount: number;
  categories: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
  onComplete: (allocations: CategoryAllocation[]) => void;
  onBack: () => void;
  initialAllocations: CategoryAllocation[];
}

export default function BudgetStepTwo({
  totalAmount,
  categories,
  onComplete,
  onBack,
  initialAllocations,
}: BudgetStepTwoProps) {
  const [allocations, setAllocations] = useState<CategoryAllocation[]>(initialAllocations);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [allocationAmount, setAllocationAmount] = useState(0);

  const totalAllocated = allocations.reduce((sum, allocation) => sum + allocation.allocated, 0);
  const remainingAmount = totalAmount - totalAllocated;

  const handleAddAllocation = () => {
    if (selectedCategoryId && allocationAmount > 0) {
      const category = categories.find(cat => cat.id === selectedCategoryId);
      if (category) {
        const newAllocation: CategoryAllocation = {
          categoryId: category.id,
          categoryName: category.name,
          categoryColor: category.color,
          categoryIcon: category.icon,
          allocated: allocationAmount,
        };

        setAllocations(prev => [...prev, newAllocation]);
        setSelectedCategoryId('');
        setAllocationAmount(0);
      }
    }
  };

  const handleRemoveAllocation = (categoryId: string) => {
    setAllocations(prev => prev.filter(allocation => allocation.categoryId !== categoryId));
  };

  const handleUpdateAllocation = (categoryId: string, newAmount: number) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.categoryId === categoryId ? { ...allocation, allocated: newAmount } : allocation
      )
    );
  };

  const availableCategories = categories.filter(
    category => !allocations.some(allocation => allocation.categoryId === category.id)
  );

  const handleComplete = () => {
    onComplete(allocations);
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Total Budget:</span>
          <span className="font-semibold">Rs. {totalAmount.toLocaleString()}</span>
        </div>
        <div className="mb-2 flex items-center justify-between">
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

      {/* Add New Allocation */}
      {availableCategories.length > 0 && (
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Add Category Allocation</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">Category</label>
              <select
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                className="border-input bg-background text-foreground w-full rounded-md border p-2"
              >
                <option value="">Select category</option>
                {availableCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={allocationAmount || ''}
                onChange={e => setAllocationAmount(Number(e.target.value))}
                placeholder="0"
                min="0"
                max={remainingAmount > 0 ? remainingAmount : undefined}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddAllocation}
                disabled={
                  !selectedCategoryId || allocationAmount <= 0 || allocationAmount > remainingAmount
                }
                className="w-full"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Allocations */}
      {allocations.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Current Allocations</h3>
          {allocations.map(allocation => (
            <div
              key={allocation.categoryId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{allocation.categoryIcon}</span>
                <div>
                  <p className="font-medium">{allocation.categoryName}</p>
                  <p className="text-muted-foreground text-sm">
                    {((allocation.allocated / totalAmount) * 100).toFixed(1)}% of budget
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={allocation.allocated}
                  onChange={e =>
                    handleUpdateAllocation(allocation.categoryId, Number(e.target.value))
                  }
                  className="w-32"
                  min="0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAllocation(allocation.categoryId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleComplete} className="flex flex-1 items-center justify-center gap-2">
          <Check className="h-4 w-4" />
          Create Budget
        </Button>
      </div>
    </div>
  );
}
