'use client';

import { useEffect, useState } from 'react';
import _ from 'lodash';
import { toast } from 'sonner';

import {
  UserProfile,
  BudgetOverview,
  StreakCounter,
  ExpenseCategories,
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
import { ApiResponse } from '@/types';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { USER_CURRENCY } from '@/constants';

const streakData = {
  currentStreak: 12,
  longestStreak: 45,
};

interface UserBudgetOverview {
  monthlyBudget: number;
  monthlySpent: number;
  remainingBudget: number;
  spentPercentage: number;
  totalTransactions: number;
  avgDailySpending: number;
  topCategory: { name: string; icon: string } | null;
  monthlyChange: number;
}

interface User {
  name: string;
  email: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  monthlyBudget: number;
  id: string;
}

interface CategoryStats {
  categoryId: string;
  totalAmount: number;
  count: number;
  categoryName: string;
  categoryIcon: string;
  budgetPercentage: string;
}

type UserProfileApiResponse = ApiResponse<User>;
type UserBudgetOverviewResponse = ApiResponse<UserBudgetOverview>;
type CategoryStatsApiResponse = ApiResponse<CategoryStats[]>;

function DashboardPage({
  preloadedData,
  isLoading,
}: {
  isLoading: boolean;
  preloadedData?: Record<string, unknown>;
  error?: Error | null;
  retry?: () => void;
}) {
  const userData = useAppSelector(state => state.user);
  const [mode, setMode] = useState(MODE_OPTIONS.VIEW);
  const [budget, setBudget] = useState(userData?.monthlyBudget || 0);
  const [budgetOverview, setBudgetOverview] = useState<UserBudgetOverview | {}>({});
  const [isExpenseLogOpen, setIsExpenseLogOpen] = useState(false);
  const [expenseCategoriesData, setExpenseCategoriesData] = useState<CategoryStats[] | []>([]);

  const quickStats = {
    totalTransactions: _.get(budgetOverview, 'totalTransactions', 0),
    avgDailySpending: _.get(budgetOverview, 'avgDailySpending', 0),
    topCategory: _.get(budgetOverview, 'topCategory', null),
    monthlyChange: _.get(budgetOverview, 'monthlyChange', 0),
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      const userBudgetOverviewResponse =
        preloadedData?.budgetOverview as UserBudgetOverviewResponse;
      const categoryStatsResponse = preloadedData?.categoryStats as CategoryStatsApiResponse;

      const userBudgetData = userBudgetOverviewResponse?.data;
      const categoryStatsData = categoryStatsResponse ? categoryStatsResponse.data : [];

      setBudgetOverview(userBudgetData);
      setExpenseCategoriesData(categoryStatsData);
    }
  }, [isLoading, preloadedData]);

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
          currentExpenses={_.get(budgetOverview, 'monthlySpent', 0)}
          mode={mode}
          onBudgetChange={onBudgetChange}
          className="lg:col-span-2"
        />
      </div>

      {/* Second Row - Stats and Streak */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickStats
          stats={quickStats}
          currency={USER_CURRENCY}
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
          categories={expenseCategoriesData}
          totalExpenses={_.get(budgetOverview, 'monthlySpent', 0)}
          currency={USER_CURRENCY}
        />
        <RecentTransactions currency={USER_CURRENCY} />
      </div>

      {/* Call to Action Section */}
      <div className="from-primary/10 to-primary/5 border-primary/20 rounded-lg border bg-linear-to-r p-6">
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
    {
      key: 'budgetOverview',
      fn: () => apiService.get<ApiResponse<UserBudgetOverviewResponse>>('/users/budget-overview'),
    },
    {
      key: 'categoryStats',
      fn: () => apiService.get<CategoryStatsApiResponse>('/categories/stats'),
    },
  ],
  onSuccess: (data: Record<string, unknown>, dispatch: AppDispatch) => {
    const userData = data.userProfile as UserProfileApiResponse;
    const userDetails = userData.data;
    dispatch(setUser(userDetails));
  },
};

export default withPreloader(DashboardPage, config);
