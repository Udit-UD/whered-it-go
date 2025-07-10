'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import _ from 'lodash';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import handleGoogleLogin from '@/lib/auth';
import { clearUser, setUser } from '@/store/slices/userSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onGoogleLogin = async () => {
    try {
      await handleGoogleLogin({
        onSuccess: response => {
          const userData = { ..._.get(response, 'data.user', {}), isAuthenticated: true };
          dispatch(setUser(userData));
          toast.success('Login successful!');
          router.push('/dashboard');
        },
        onError: error => {
          toast.error(`Login failed: ${_.get(error, 'message', 'An error occurred')}`);
        },
      });
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const onLogout = () => {
    dispatch(clearUser());
    toast.success('Logged out successfully');
    router.push('/');
  };

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
            {user.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onGoogleLogin}>
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
