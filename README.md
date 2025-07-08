# Where'd It Go

A modern financial tracking web application built with Next.js 15, TypeScript, and shadcn/ui to help you understand where your money goes and take control of your finances.

## 💰 About

"Where'd It Go" is a comprehensive personal finance tracker that helps you:

- Track your income and expenses
- Categorize your spending
- Visualize your financial habits
- Set and monitor budgets
- Understand where your money really goes

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Font**: Geist Sans & Geist Mono

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 shadcn/ui Components

This project uses shadcn/ui for components. The setup includes:

- **Button**: Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input**: Form input with proper styling
- **Card**: Container component with header, content, footer
- **Alert**: For displaying messages and notifications
- **Spinner**: Loading indicator

### Adding New Components

To add more shadcn/ui components, you can manually create them in `src/components/ui/` following the shadcn/ui patterns, or use the CLI:

```bash
npx shadcn@latest add [component-name]
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with a custom configuration that includes:

- Dark mode support
- Custom color system with CSS variables
- shadcn/ui design tokens
- Animation utilities

### TypeScript

Strict TypeScript configuration with:

- Path aliases (`@/*` for `src/*`)
- ESNext module resolution
- Incremental compilation

## 📦 Key Features

- **Transaction Tracking**: Record income and expenses with detailed categorization
- **Budget Management**: Set monthly/yearly budgets and track spending against them
- **Financial Analytics**: Visualize spending patterns and trends
- **Category Management**: Organize expenses by custom categories
- **Expense Reports**: Generate detailed financial reports
- **Error Handling**: Comprehensive error boundaries and error pages
- **Loading States**: Global and component-level loading indicators
- **Type Safety**: Full TypeScript coverage for financial data
- **Responsive Design**: Mobile-first approach for on-the-go expense tracking
- **Modern UI**: Clean, accessible components with shadcn/ui
- **Custom Hooks**: Reusable React hooks for financial calculations
- **Utility Functions**: Helper functions for currency formatting and calculations

## 🚀 Production Deployment

The app is ready for production deployment with:

- Optimized build output
- Static generation where possible
- Proper error handling
- SEO-friendly structure
- Performance optimizations

### Environment Variables

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
