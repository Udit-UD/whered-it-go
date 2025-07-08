import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/appComponents/Navbar';
import { ReduxProvider } from '@/components/ReduxProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Where'd It Go - Personal Finance Tracker",
  description:
    'Track your finances and understand where your money goes. A modern personal finance management application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ReduxProvider>
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
