// App configuration
export const APP_CONFIG = {
  name: "Where'd It Go",
  description: "Track your items and never lose them again",
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
  items: {
    list: "/api/items",
    create: "/api/items",
    update: (id: string) => `/api/items/${id}`,
    delete: (id: string) => `/api/items/${id}`,
  },
} as const

// Navigation items
export const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Items",
    href: "/items",
  },
  {
    title: "Categories",
    href: "/categories",
  },
  {
    title: "Search",
    href: "/search",
  },
] as const

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
} as const
