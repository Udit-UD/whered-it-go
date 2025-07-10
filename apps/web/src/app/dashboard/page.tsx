'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  UserProfile,
  BudgetOverview,
  StreakCounter,
  ExpenseCategories,
  RecentTransactions,
  QuickStats,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ExpenseLogModal from '@/components/commonComponents/ExpenseLogModal';
import apiService from '@/lib/apiService';
import { setUser } from '@/store/slices/userSlice';
import { getFullName } from '@/lib/utils';
import { MODE_OPTIONS } from './utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import withPreloader from '@/hocs/withPreloader';
import { AppDispatch } from '@/store';

const budgetData = {
  currentExpenses: 18500,
  currency: '₹',
};

const streakData = {
  currentStreak: 12,
  longestStreak: 45,
};

const expenseCategories = [
  {
    name: 'Food',
    amount: 5500,
    color: '#ef4444',
    percentage: 29.7,
  },
  {
    name: 'Transportation',
    amount: 3200,
    color: '#3b82f6',
    percentage: 17.3,
  },
  {
    name: 'Shopping',
    amount: 4100,
    color: '#f59e0b',
    percentage: 22.2,
  },
  {
    name: 'Entertainment',
    amount: 2400,
    color: '#10b981',
    percentage: 13.0,
  },
  {
    name: 'Bills',
    amount: 3300,
    color: '#8b5cf6',
    percentage: 17.8,
  },
];

const recentTransactions = [
  {
    id: '1',
    description: 'Grocery Shopping',
    amount: 1250,
    category: 'Food',
    date: '2025-07-05',
    type: 'expense' as const,
  },
  {
    id: '2',
    description: 'Uber Ride',
    amount: 180,
    category: 'Transportation',
    date: '2025-07-05',
    type: 'expense' as const,
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    amount: 649,
    category: 'Entertainment',
    date: '2025-07-04',
    type: 'expense' as const,
  },
  {
    id: '4',
    description: 'Coffee Shop',
    amount: 150,
    category: 'Food',
    date: '2025-07-04',
    type: 'expense' as const,
  },
  {
    id: '5',
    description: 'Freelance Payment',
    amount: 15000,
    category: 'Income',
    date: '2025-07-03',
    type: 'income' as const,
  },
];

const quickStats = {
  totalTransactions: 47,
  avgDailySpending: 616,
  topCategory: 'Food',
  monthlyChange: 12.5,
};

interface UserProfileApiResponse {
  data: {
    data: {
      user: {
        name: string;
        email: string;
        profileImage: string;
        firstName: string;
        lastName: string;
        monthlyBudget: number;
        id: string;
      };
    };
  };
}

function DashboardPage() {
  const userData = useAppSelector(state => state.user);
  const [mode, setMode] = useState(MODE_OPTIONS.VIEW);
  const [budget, setBudget] = useState(userData?.monthlyBudget || 0);
  const [isExpenseLogOpen, setIsExpenseLogOpen] = useState(false);

  const dispatch = useAppDispatch();

  const getCurrentMonthAndYear = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const updateProfile = async (payload: object) => {
    try {
      const response = await apiService.patch('/users/', payload);
      if (response.success) {
        dispatch(setUser({ ...userData, ...payload }));
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  const onImageUpload = async (url: string) => {
    const payload = {
      imageUrl: url,
    };
    const result = await updateProfile(payload);
    if (!result.success) {
      toast.error(result.message || 'Failed to update profile image');
      return;
    } else {
      toast.success('Profile image updated successfully');
      dispatch(setUser({ profilePicture: url }));
      return;
    }
  };

  // STATE UPDATE FUNCTIONS
  const toggleEditBudget = () => {
    setMode(mode === MODE_OPTIONS.VIEW ? MODE_OPTIONS.UPDATE : MODE_OPTIONS.VIEW);
  };

  const onCancel = () => {
    setMode(MODE_OPTIONS.VIEW);
    setBudget(userData?.monthlyBudget || 0);
  };

  const onBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    setBudget(Number(value));
  };

  const onBudgetSave = async () => {
    const payload = {
      monthlyBudget: budget,
    };
    const result = await updateProfile(payload);
    if (result.success) {
      toast.success('Budget updated successfully');
      setMode(MODE_OPTIONS.VIEW);
    } else {
      toast.error('Failed to update budget');
    }
  };

  return (
    <div className="mx-auto w-3/4 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your expense overview for {getCurrentMonthAndYear()}.
          </p>
        </div>
        <div className="flex space-x-3">
          {mode === MODE_OPTIONS.VIEW ? (
            <>
              <Button variant="outline" size="sm" onClick={toggleEditBudget}>
                Edit Budget
              </Button>
              <Dialog open={isExpenseLogOpen} onOpenChange={setIsExpenseLogOpen}>
                <DialogTrigger asChild>
                  <button className="btn-sm">Add Expense</button>
                </DialogTrigger>
                {isExpenseLogOpen && <ExpenseLogModal onClose={() => setIsExpenseLogOpen(false)} />}
              </Dialog>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="bg-white text-black" size="sm" onClick={onBudgetSave}>
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Top Row - User Profile and Budget Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {userData ? (
          <UserProfile
            name={getFullName(userData.firstName, userData.lastName)}
            email={userData.email}
            profileImage={userData.profilePicture || ''}
            className="lg:col-span-1"
            allowUpload={true}
            onProfileImageUpload={onImageUpload}
          />
        ) : null}
        <BudgetOverview
          monthlyBudget={budget}
          currentExpenses={budgetData.currentExpenses}
          currency={budgetData.currency}
          mode={mode}
          onBudgetChange={onBudgetChange}
          className="lg:col-span-2"
        />
      </div>

      {/* Second Row - Stats and Streak */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickStats
          stats={quickStats}
          currency={budgetData.currency}
          className="md:col-span-2 lg:col-span-2"
        />
        <StreakCounter
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>

      {/* Third Row - Categories and Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpenseCategories
          categories={expenseCategories}
          totalExpenses={budgetData.currentExpenses}
          currency={budgetData.currency}
        />
        <RecentTransactions transactions={recentTransactions} currency={budgetData.currency} />
      </div>

      {/* Call to Action Section */}
      <div className="from-primary/10 to-primary/5 border-primary/20 rounded-lg border bg-gradient-to-r p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h3 className="text-foreground text-lg font-semibold">Keep your streak going! 🔥</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              You&apos;re doing great with tracking your expenses. Add today&apos;s expenses to
              maintain your {streakData.currentStreak}-day streak.
            </p>
          </div>
          <Button className="w-full md:w-auto">Log Today&apos;s Expenses</Button>
        </div>
      </div>
    </div>
  );
}

const config = {
  apiCalls: [
    {
      key: 'userProfile',
      fn: () => apiService.get<UserProfileApiResponse>('/users/'),
    },
  ],
  onSuccess: (data: Record<string, unknown>, dispatch: AppDispatch) => {
    const userData = data.userProfile as UserProfileApiResponse;
    const userDetails = userData.data?.data.user;
    dispatch(setUser(userDetails));
  },
};

export default withPreloader(DashboardPage, config);
