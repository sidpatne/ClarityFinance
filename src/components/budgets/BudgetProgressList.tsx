
"use client";

import type { Budget, Category, Transaction } from '@/types';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryIcon } from '@/components/icons';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BudgetProgressListProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  selectedMonthYear: string; // YYYY-MM
}

export function BudgetProgressList({ budgets, categories, transactions, selectedMonthYear }: BudgetProgressListProps) {
  const { formatCurrency } = useCurrency();
  
  const getCategorySpentAmount = (categoryId: string, monthYear: string): number => {
    return transactions
      .filter(txn => txn.categoryId === categoryId && txn.date.startsWith(monthYear))
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const budgetsForMonth = budgets.filter(b => b.monthYear === selectedMonthYear);

  if (budgetsForMonth.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress ({selectedMonthYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No budgets set for {selectedMonthYear}.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress ({selectedMonthYear})</CardTitle>
        <CardDescription>Track your spending against your set budget goals for the selected month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgetsForMonth.map((budget) => {
          const category = categories.find(c => c.id === budget.categoryId);
          if (!category) return null;

          const spentAmount = getCategorySpentAmount(budget.categoryId, budget.monthYear);
          const progressPercentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
          const remainingAmount = budget.amount - spentAmount;

          let progressBarColor = "bg-primary"; // Default (blue)
          if (progressPercentage > 100) progressBarColor = "bg-destructive"; // Red if over budget
          else if (progressPercentage > 80) progressBarColor = "bg-yellow-500"; // Yellow if nearing budget

          return (
            <div key={budget.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CategoryIcon name={category.iconName} className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-lg">{category.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Budget: {formatCurrency(budget.amount)}
                </div>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="w-full h-3 mb-1" indicatorClassName={progressBarColor} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: {formatCurrency(spentAmount)}</span>
                <span className={remainingAmount < 0 ? 'text-destructive font-medium' : ''}>
                  {remainingAmount >= 0 
                    ? `Remaining: ${formatCurrency(remainingAmount)}`
                    : `Overspent: ${formatCurrency(Math.abs(remainingAmount))}`}
                </span>
              </div>
               {progressPercentage > 100 && (
                <p className="text-xs text-destructive mt-1">You've exceeded your budget for {category.name}!</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
