'use client';

import React, { useState } from 'react';
import _ from 'lodash';
import { toast } from 'sonner';
import apiService from '@/lib/apiService';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { ICONS } from '@/constants/Icons';
import { Check, Loader, PlusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DatePickerInput from '../dashboard/DatePicker';
import withPreloader from '@/hocs/withPreloader';

interface Category {
  _id: string;
  name: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriesResponse {
  data: {
    success: boolean;
    data: Category[];
    message: string;
  };
}

interface CategoryResponse {
  success: boolean;
  data: Category;
  message: string;
}

interface ExpenseLogModalProps {
  onClose?: () => void;
  onSubmit?: (expense: { title: string; amount: number; categoryId: string }) => void;
}

const inititalExpenseDetails = {
  title: '',
  amount: '',
  category: { _id: 'NEW_CATEGORY', name: '', icon: '🍽️' },
  date: new Date(),
};

const EMPTY_ARRAY: [] = [];

const ExpenseLogModal: React.FC<
  ExpenseLogModalProps & { preloadedData?: Record<string, unknown> }
> = ({ onClose, onSubmit, preloadedData }) => {
  const [expenseDetails, setExpenseDetails] = useState(inititalExpenseDetails);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const categoriesResponse = preloadedData?.categories as CategoriesResponse;
  const userCategoriesList = categoriesResponse?.data?.data || EMPTY_ARRAY;

  const [categories, setCategories] = useState<Category[]>(
    userCategoriesList.length > 0 ? userCategoriesList : []
  );
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    category?: string;
    newCategoryName?: string;
    newCategoryIcon?: string;
  }>({});
  const selectedCategoryId = _.get(expenseDetails, 'category._id', '');

  const saveNewCategory = async () => {
    if (!expenseDetails.category.name.trim() || !expenseDetails.category.icon) {
      return false;
    }

    setIsSavingCategory(true);
    try {
      const response = await apiService.post<CategoryResponse>('/categories', {
        name: expenseDetails.category.name.trim(),
        icon: expenseDetails.category.icon,
      });

      if (response.data.success) {
        const newCategory = {
          _id: response.data.data._id,
          name: response.data.data.name,
          icon: response.data.data.icon,
        };

        setCategories(prev => [...prev, newCategory]);

        setExpenseDetails(prev => ({
          ...prev,
          category: newCategory,
        }));

        setIsAddingCategory(false);
        toast.success('Category added successfully!');
      }
    } catch (error) {
      toast.error(_.get(error, 'message', 'Failed to save category'));
    } finally {
      setIsSavingCategory(false);
    }
  };

  const onUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (name === 'category') {
      setExpenseDetails(prev => ({
        ...prev,
        category: {
          ...prev.category,
          name: value,
        },
      }));
      return;
    }

    setExpenseDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChooseIcon = (icon: string) => {
    setExpenseDetails(prev => ({
      ...prev,
      category: {
        ...prev.category,
        icon,
      },
    }));
  };

  const onCategorySelect = (id: string) => {
    const selectedCategory = _.find(categories, { _id: id });
    if (selectedCategory) {
      setExpenseDetails(prev => ({
        ...prev,
        category: selectedCategory,
      }));
      setIsAddingCategory(false);

      // Clear category error if one exists
      if (errors.category) {
        setErrors(prev => ({
          ...prev,
          category: undefined,
        }));
      }
    }
  };

  const onDateChange = (date: Date) => {
    setExpenseDetails(prev => ({
      ...prev,
      date,
    }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Title validation
    if (!expenseDetails.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (expenseDetails.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    // Amount validation
    if (!expenseDetails.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = Number(expenseDetails.amount);
      if (isNaN(amount)) {
        newErrors.amount = 'Please enter a valid number';
      } else if (amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount cannot exceed ₹10,00,000';
      }
    }

    // Category validation
    if (selectedCategoryId === 'NEW_CATEGORY') {
      if (!expenseDetails.category.name.trim()) {
        newErrors.category = 'Category name is required';
      } else if (expenseDetails.category.name.trim().length < 2) {
        newErrors.category = 'Category name must be at least 2 characters long';
      } else {
        const duplicateCategory = categories.find(
          cat => cat.name.toLowerCase() === expenseDetails.category.name.trim().toLowerCase()
        );
        if (duplicateCategory) {
          newErrors.category = 'Category with this name already exists';
        }
      }

      if (!expenseDetails.category.icon) {
        newErrors.newCategoryIcon = 'Please select an icon for the category';
      }
    } else if (!selectedCategoryId || selectedCategoryId === '') {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (isAddingCategory) {
      toast.error('Please save the new category before logging the expense.');
      return;
    }

    const categoryId = selectedCategoryId;

    onSubmit?.({
      title: expenseDetails.title.trim(),
      amount: Number(expenseDetails.amount),
      categoryId: categoryId,
    });

    setExpenseDetails(inititalExpenseDetails);
    setIsAddingCategory(false);
    setErrors({});
    onClose?.();
  };

  const handleCancel = () => {
    setExpenseDetails(inititalExpenseDetails);
    setIsAddingCategory(false);
    setErrors({});
    onClose?.();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Log New Expense</DialogTitle>
        <DialogDescription>Add a new expense to track your spending.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Title Field */}
        <div className="flex flex-col gap-2 *:space-y-2">
          <label className="text-foreground text-sm font-medium">
            Title <span className="text-red-300">*</span>
          </label>
          <Input
            name="title"
            placeholder="Enter expense title..."
            value={_.get(expenseDetails, 'title', '')}
            id="title"
            onChange={onUpdateInput}
            className={cn(errors.title && 'border-red-300')}
          />
          {errors.title && <p className="mt-1 text-xs font-medium text-red-300">{errors.title}</p>}
        </div>

        {/* Amount Field */}
        <div className="flex flex-col gap-2 *:space-y-2">
          <label className="text-foreground text-sm font-medium">
            Amount <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform">
              ₹
            </span>
            <Input
              name="amount"
              placeholder="150"
              value={_.get(expenseDetails, 'amount', '')}
              onChange={onUpdateInput}
              className={cn('pl-8', errors.amount && 'border-red-300')}
              id="amount"
              min="0"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs font-medium text-red-300">{errors.amount}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 *:space-y-2">
          <label className="text-foreground text-sm font-medium">
            Date <span className="text-red-300">*</span>
          </label>
          <DatePickerInput date={_.get(expenseDetails, 'date')} onDateChange={onDateChange} />
          {errors.amount && (
            <p className="mt-1 text-xs font-medium text-red-300">{errors.amount}</p>
          )}
        </div>

        {isAddingCategory ? (
          <div className="border-primary/20 bg-primary/5 space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-sm font-medium">
                New Category <span className="text-red-300">*</span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingCategory(false);
                  setErrors(prev => ({ ...prev, category: undefined, newCategoryIcon: undefined }));
                }}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    // className={cn(
                    //   'h-8 w-12 p-0 text-lg',
                    //   errors.newCategoryIcon && 'border-red-300'
                    // )}
                  >
                    {_.get(expenseDetails, 'category.icon', '🍽️')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {_.map(ICONS, (icon, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          onChooseIcon(icon);
                          // Clear icon error if one exists
                          if (errors.newCategoryIcon) {
                            setErrors(prev => ({ ...prev, newCategoryIcon: undefined }));
                          }
                        }}
                        className="hover:bg-secondary cursor-pointer justify-center p-2 text-lg"
                      >
                        {icon}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="text"
                placeholder="Enter category name..."
                value={_.get(expenseDetails, 'category.name', '')}
                id="category"
                name="category"
                onChange={onUpdateInput}
                className={cn('flex-1', errors.category && 'border-red-300')}
              />
              <Button variant="outline" onClick={saveNewCategory} disabled={isSavingCategory}>
                {isSavingCategory ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.category && (
              <p className="mt-1 text-xs font-medium text-red-300">{errors.category}</p>
            )}
            {errors.newCategoryIcon && (
              <p className="mt-1 text-xs font-medium text-red-300">{errors.newCategoryIcon}</p>
            )}
          </div>
        ) : null}

        {/* Category Selection */}
        <div className="flex flex-col gap-2 *:space-y-2">
          <label className="text-foreground text-sm font-medium">
            Category <span className="text-red-300">*</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {categories.map(category => (
              <Card
                key={category._id}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:scale-105',
                  selectedCategoryId === category._id
                    ? 'ring-primary bg-primary/10 ring-2'
                    : 'hover:bg-secondary'
                )}
                onClick={() => onCategorySelect(category._id)}
              >
                <CardContent className="p-3 text-center">
                  <div className="mb-1 text-lg">{category.icon}</div>
                  <div className="truncate text-xs font-medium">{category.name}</div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Category Button */}
            <Card
              className={cn(
                'hover:bg-secondary cursor-pointer border-dashed transition-all duration-200 hover:scale-105',
                selectedCategoryId === 'NEW_CATEGORY' &&
                  isAddingCategory &&
                  'ring-primary bg-primary/10 ring-2'
              )}
              onClick={() => {
                setIsAddingCategory(true);
                setExpenseDetails(prev => ({
                  ...prev,
                  category: { _id: 'NEW_CATEGORY', name: '', icon: '🍽️' },
                }));
              }}
            >
              <CardContent className="p-3 text-center">
                <PlusIcon className="text-muted-foreground mx-auto mb-1 h-5 w-5" />
                <div className="text-muted-foreground text-xs font-medium">Add New</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSavingCategory}>
          {isSavingCategory ? 'Saving Category...' : 'Log Expense'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const config = {
  apiCalls: [
    {
      key: 'categories',
      fn: () => apiService.get<CategoriesResponse>('/categories/'),
    },
  ],
};

export default withPreloader(ExpenseLogModal, config);
