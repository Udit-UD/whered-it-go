'use client';

import { UserProfile } from '@/components/dashboard/UserProfile';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { ExpenseCategories } from '@/components/dashboard/ExpenseCategories';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ExpenseLogModal from '@/components/commonComponents/ExpenseLogModal';

// Dummy data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage: '',
};

const budgetData = {
  monthlyBudget: 25000,
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

export default function DashboardPage() {
  const getCurrentMonthAndYear = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Dialog>
            <DialogTrigger size="sm">Add Expense</DialogTrigger>
            <ExpenseLogModal />
          </Dialog>
        </div>
      </div>

      {/* Top Row - User Profile and Budget Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UserProfile
          name={userData.name}
          email={userData.email}
          profileImage={userData.profileImage}
          className="lg:col-span-1"
        />
        <BudgetOverview
          monthlyBudget={budgetData.monthlyBudget}
          currentExpenses={budgetData.currentExpenses}
          currency={budgetData.currency}
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
