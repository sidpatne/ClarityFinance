"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { BudgetGoalSetter } from "@/components/budgets/BudgetGoalSetter";
import { BudgetProgressList } from "@/components/budgets/BudgetProgressList";
import type { Budget, Category, Transaction } from "@/types";
import { initialBudgets, initialCategories, initialTransactions } from "@/lib/data";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(new Date().toISOString().slice(0, 7));
  const { toast } = useToast();
  
  // Simulate data fetching
  // In a real app, this data would come from a backend or global state
  useEffect(() => {
    // No need to set initial data here again if it's static,
    // but useful if it were fetched.
  }, []);

  const handleSetBudget = (data: Omit<Budget, 'id'>) => {
    const existingBudgetIndex = budgets.findIndex(
      b => b.categoryId === data.categoryId && b.monthYear === data.monthYear
    );

    if (existingBudgetIndex > -1) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = { ...updatedBudgets[existingBudgetIndex], amount: data.amount };
      setBudgets(updatedBudgets);
      toast({ title: "Budget Updated", description: `Budget for ${categories.find(c=>c.id === data.categoryId)?.name} in ${data.monthYear} updated.`});
    } else {
      // Add new budget
      const newBudget: Budget = {
        ...data,
        id: `bud-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      };
      setBudgets(prev => [...prev, newBudget]);
      toast({ title: "Budget Set", description: `Budget for ${categories.find(c=>c.id === data.categoryId)?.name} in ${data.monthYear} created.`});
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Manage Budgets" 
        description="Set and track your monthly spending goals."
        icon={Target}
      />
      
      <div className="mb-8">
        <BudgetGoalSetter 
          categories={categories} 
          existingBudgets={budgets}
          onSetBudget={handleSetBudget} 
        />
      </div>
      
      <div className="mb-6 max-w-xs">
        <Label htmlFor="month-selector">Select Month to View Progress</Label>
        <Input 
          id="month-selector"
          type="month" 
          value={selectedMonthYear} 
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="mt-1"
        />
      </div>

      <BudgetProgressList 
        budgets={budgets} 
        categories={categories} 
        transactions={transactions} 
        selectedMonthYear={selectedMonthYear}
      />
    </div>
  );
}
