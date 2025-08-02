'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, Check } from 'lucide-react';
import BudgetStepOne from './BudgetStepOne';
import BudgetStepTwo from './BudgetStepTwo';
import { BudgetCategoryInput } from './types';
import { Category } from '@/types';

interface BudgetCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated: (budget: {
    totalAmount: number;
    note?: string;
    allocations: BudgetCategoryInput[];
  }) => void;
  categories: Category[];
}

export interface CategoryAllocation {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  allocatedAmount: number;
  note?: string;
}

interface BudgetFormData {
  totalAmount: number;
  note: string;
  allocations: BudgetCategoryInput[];
}

export default function BudgetCreationModal({
  isOpen,
  onClose,
  onBudgetCreated,
  categories,
}: BudgetCreationModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<BudgetFormData>({
    totalAmount: 0,
    note: '',
    allocations: [],
  });

  const handleStepOneNext = (data: { totalAmount: number; note: string }) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (allocations: BudgetCategoryInput[]) => {
    const finalData = {
      ...formData,
      allocations,
    };
    onBudgetCreated(finalData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      totalAmount: 0,
      note: '',
      allocations: [],
    });
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={currentStep === 1 ? 'sm:max-w-2xl' : 'w-auto min-w-[672px] sm:max-w-[90vw]'}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === 2 && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {currentStep === 1 ? 'Create Monthly Budget' : 'Allocate to Categories'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? 'Set your total monthly budget and add an optional note'
              : 'Distribute your budget across different spending categories'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  currentStep >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Budget Amount</span>
            </div>
            <div className="bg-border h-px w-8" />
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  currentStep >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Category Allocation</span>
            </div>
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <BudgetStepOne
              onNext={handleStepOneNext}
              onCancel={handleClose}
              initialData={{ totalAmount: formData.totalAmount, note: formData.note }}
            />
          )}

          {currentStep === 2 && (
            <BudgetStepTwo
              totalAmount={formData.totalAmount}
              categories={categories}
              onComplete={handleStepTwoComplete}
              onBack={handleBack}
              initialAllocations={formData.allocations}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
