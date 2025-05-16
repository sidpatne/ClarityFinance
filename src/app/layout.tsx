import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter as a clean sans-serif font
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ClarityFinance',
  description: 'Budgeting and expense tracking for financial clarity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AppLayoutClient>{children}</AppLayoutClient>
        <Toaster />
      </body>
    </html>
  );
}
