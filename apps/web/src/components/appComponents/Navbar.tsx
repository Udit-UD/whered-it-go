'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import handleGoogleLogin, { handleRedirectResult } from '@/lib/auth';
import { RootState } from '@/store';
import { clearUser, setUser } from '@/store/slices/userSlice';

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result) {
          if (result.success) {
            const userData = { ..._.get(result, 'data.user', {}), isAuthenticated: true };
            console.log('Google login successful:', userData);
            dispatch(setUser(userData));
            toast.success('Login successful!');
            router.push('/dashboard');
            console.log('Redirect login successful:', result);
          } else {
            console.error('Redirect login failed:', result.message);
            alert(`Login failed: ${result.message}`);
          }
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
      }
    };

    checkRedirectResult();
  }, []);

  const onGoogleLogin = async () => {
    try {
      const result = await handleGoogleLogin({
        onSuccess: response => {
          const userData = { ..._.get(response, 'data.user', {}), isAuthenticated: true };
          console.log('Google login successful:', userData);
          dispatch(setUser(userData));
          toast.success('Login successful!');
          router.push('/dashboard');
        },
        onError: error => {
          toast.error(`Login failed: ${_.get(error, 'message', 'An error occurred')}`);
        },
      });

      if (result.success) {
        if (result.message?.includes('Redirecting')) {
          console.log('Redirecting to Google...');
          return;
        }
        console.log('Google login completed successfully');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      if (!String(error).includes('popup-blocked')) {
        alert('An unexpected error occurred. Please try again.');
      }
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
