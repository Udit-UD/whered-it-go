import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <div className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-lg font-bold">💰</span>
              </div>
              <span className="text-xl font-bold">Where&apos;d It Go</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link
              href="/dashboard"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Transactions
            </Link>
            <Link
              href="/budgets"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Budgets
            </Link>
            <Link
              href="/categories"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/reports"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Reports
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
