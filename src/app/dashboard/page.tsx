"use client";

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, Landmark, Receipt } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";
import type { Transaction, Category, Budget } from "@/types";
import { initialTransactions, initialCategories, initialBudgets } from "@/lib/data";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Simulate data fetching
  useEffect(() => {
    setTransactions(initialTransactions);
    setCategories(initialCategories);
    setBudgets(initialBudgets);
  }, []);

  const totalSpentThisMonth = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return transactions
      .filter(txn => txn.date.startsWith(currentMonth))
      .reduce((sum, txn) => sum + txn.amount, 0);
  }, [transactions]);

  const totalBudgetThisMonth = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return budgets
      .filter(b => b.monthYear === currentMonth)
      .reduce((sum, budget) => sum + budget.amount, 0);
  }, [budgets]);

  const budgetRemaining = totalBudgetThisMonth - totalSpentThisMonth;
  
  const averageDailySpending = useMemo(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    const daysInMonth = today.getDate(); // Number of days passed in the current month
    const monthlySpending = transactions
      .filter(txn => txn.date.startsWith(currentMonth))
      .reduce((sum, txn) => sum + txn.amount, 0);
    return daysInMonth > 0 ? monthlySpending / daysInMonth : 0;
  }, [transactions]);

  return (
    <div className="container mx-auto pt-10 pb-6">
      <PageHeader title="Dashboard" description="Your financial overview." icon={Landmark} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCard 
          title="Total Spent (This Month)" 
          value={`$${totalSpentThisMonth.toFixed(2)}`}
          icon={DollarSign}
          description="Sum of all transactions this month."
        />
        <SummaryCard 
          title="Budget Remaining" 
          value={`$${budgetRemaining.toFixed(2)}`}
          icon={Receipt}
          description={totalBudgetThisMonth > 0 ? `Total budget: $${totalBudgetThisMonth.toFixed(2)}` : "No budget set."}
        />
        <SummaryCard
          title="Avg. Daily Spending"
          value={`$${averageDailySpending.toFixed(2)}`}
          icon={TrendingUp}
          description="Average spending per day this month."
        />
         <SummaryCard
          title="Total Transactions"
          value={transactions.length.toString()}
          icon={Receipt}
          description="All recorded transactions."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactionsTable transactions={transactions} categories={categories} />
        </div>
        <div className="lg:col-span-1">
           <SpendingPieChart transactions={transactions} categories={categories} />
        </div>
      </div>
    </div>
  );
}
