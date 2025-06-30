import React from 'react';
import {
  Goal,
  IndianRupee,
  FileText,
  TrendingUp,
  Shield,
  Bell,
  PieChart,
  Smartphone,
  Zap,
  Users,
  Award,
  CheckCircle,
} from 'lucide-react';

export const FEATURES = [
  {
    name: 'Expense Tracking',
    icon: <FileText color="gray" size={40} />,
    description:
      'Track your daily expenses and monitor where your money goes with detailed categorization and insights.',
  },
  {
    name: 'Budgeting',
    icon: <TrendingUp color="gray" size={40} />,
    description:
      'Set monthly budgets for different categories and get alerts when you are approaching your limits.',
  },
  {
    name: 'Financial Insights',
    icon: <IndianRupee color="gray" size={40} />,
    description:
      'Get detailed analytics and reports about your spending patterns and financial habits.',
  },
  {
    name: 'Goal Setting',
    icon: <Goal color="gray" size={40} />,
    description:
      'Set financial goals and track your progress towards achieving them with smart recommendations.',
  },
  {
    name: 'AI Assistance',
    icon: <Shield color="gray" size={40} />,
    description:
      'Let AI analyze your spending habits and provide personalized tips to save money and optimize your budget.',
  },
  {
    name: 'Smart Notifications',
    icon: <Bell color="gray" size={40} />,
    description:
      'Get intelligent alerts for unusual spending, bill reminders, and budget notifications at the right time.',
  },
  {
    name: 'Advanced Analytics',
    icon: <PieChart color="gray" size={40} />,
    description:
      'Visualize your financial data with interactive charts, trends analysis, and predictive spending models.',
  },
  {
    name: 'Mobile Sync',
    icon: <Smartphone color="gray" size={40} />,
    description:
      'Seamlessly sync across all your devices with real-time updates and offline access to your financial data.',
  },
];

export const REASONS = [
  {
    icon: <TrendingUp className="h-8 w-8 text-green-400" />,
    title: 'Smart Budgeting',
    description:
      "Finally, a budget that doesn't judge you for buying that third coffee. Our smart budgeting adapts to your lifestyle, not the other way around.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-400" />,
    title: 'AI Assistance',
    description:
      "Meet your financial therapist that never sleeps. Our AI spots your spending patterns and gently suggests where your money should (and shouldn't) go.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-purple-400" />,
    title: 'Effortless Expense Logging',
    description:
      "Log expenses faster than you can say \"I'll remember this later\" (spoiler: you won't). One tap and you're done.",
  },
  {
    icon: <Award className="h-8 w-8 text-yellow-400" />,
    title: 'Streak Rewards',
    description:
      'Turn saving money into a game! Maintain your financial streaks and unlock rewards. Who knew being responsible could be this addictive?',
  },
  {
    icon: <Users className="h-8 w-8 text-orange-400" />,
    title: 'Goal Planning',
    description:
      'From "buying a house" to "not eating instant noodles for dinner again" - we help you plan and achieve goals of all sizes.',
  },
  {
    icon: <Shield className="h-8 w-8 text-emerald-400" />,
    title: 'Beautiful UI That Actually Works',
    description:
      "A finance app so pretty, you'll want to show it off. And unlike your ex, this one actually helps you grow.",
  },
];
