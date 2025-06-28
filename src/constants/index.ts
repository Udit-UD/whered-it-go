// App configuration
export const APP_CONFIG = {
  name: "Where'd It Go",
  description: "Track your finances and understand where your money goes",
  version: "1.0.0",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
  },
  transactions: {
    list: "/api/transactions",
    create: "/api/transactions",
    update: (id: string) => `/api/transactions/${id}`,
    delete: (id: string) => `/api/transactions/${id}`,
    stats: "/api/transactions/stats",
  },
  budgets: {
    list: "/api/budgets",
    create: "/api/budgets",
    update: (id: string) => `/api/budgets/${id}`,
    delete: (id: string) => `/api/budgets/${id}`,
  },
  categories: {
    list: "/api/categories",
    create: "/api/categories",
    update: (id: string) => `/api/categories/${id}`,
    delete: (id: string) => `/api/categories/${id}`,
  },
} as const

// Navigation items
export const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Overview of your finances",
  },
  {
    title: "Transactions",
    href: "/transactions",
    description: "View and manage your transactions",
  },
  {
    title: "Budgets",
    href: "/budgets",
    description: "Set and track your budgets",
  },
  {
    title: "Categories",
    href: "/categories",
    description: "Organize your expenses",
  },
  {
    title: "Reports",
    href: "/reports",
    description: "Financial insights and analytics",
  },
] as const

// Expense categories
export const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
  { id: "transportation", name: "Transportation", color: "#4ECDC4", icon: "🚗" },
  { id: "shopping", name: "Shopping", color: "#45B7D1", icon: "🛍️" },
  { id: "entertainment", name: "Entertainment", color: "#96CEB4", icon: "🎬" },
  { id: "bills", name: "Bills & Utilities", color: "#FFEAA7", icon: "📄" },
  { id: "healthcare", name: "Healthcare", color: "#DDA0DD", icon: "🏥" },
  { id: "education", name: "Education", color: "#98D8C8", icon: "📚" },
  { id: "travel", name: "Travel", color: "#F7DC6F", icon: "✈️" },
  { id: "housing", name: "Housing", color: "#BB8FCE", icon: "🏠" },
  { id: "other", name: "Other", color: "#85C1E9", icon: "📝" },
] as const

// Income categories
export const INCOME_CATEGORIES = [
  { id: "salary", name: "Salary", color: "#2ECC71", icon: "💼" },
  { id: "freelance", name: "Freelance", color: "#3498DB", icon: "💻" },
  { id: "business", name: "Business", color: "#9B59B6", icon: "🏢" },
  { id: "investment", name: "Investment", color: "#E67E22", icon: "📈" },
  { id: "other_income", name: "Other Income", color: "#1ABC9C", icon: "💰" },
] as const

// Currencies
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
] as const

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const

// Budget periods
export const BUDGET_PERIODS = {
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
} as const

// Theme colors
export const COLORS = {
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  secondary: {
    50: "#f8fafc",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
  },
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  danger: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
} as const
