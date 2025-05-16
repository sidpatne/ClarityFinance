"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Category, Budget } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, PlusCircle } from 'lucide-react';

const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  monthYear: z.string().regex(/^\d{4}-\d{2}$/, "Month/Year format must be YYYY-MM"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetGoalSetterProps {
  categories: Category[];
  existingBudgets: Budget[];
  onSetBudget: (data: Omit<Budget, 'id'>) => void;
}

export function BudgetGoalSetter({ categories, existingBudgets, onSetBudget }: BudgetGoalSetterProps) {
  const currentMonthYear = new Date().toISOString().slice(0, 7); // YYYY-MM

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: '',
      amount: undefined,
      monthYear: currentMonthYear,
    },
  });

  const { control, handleSubmit, watch, setValue, reset } = form;
  const selectedCategoryId = watch('categoryId');
  const selectedMonthYear = watch('monthYear');

  // Update amount field if budget for selected category and month already exists
  useState(() => {
    if (selectedCategoryId && selectedMonthYear) {
      const existing = existingBudgets.find(
        (b) => b.categoryId === selectedCategoryId && b.monthYear === selectedMonthYear
      );
      if (existing) {
        setValue('amount', existing.amount);
      } else {
        setValue('amount', undefined);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }); // This effect should run when selectedCategoryId or selectedMonthYear changes.

  const onSubmitForm = (data: BudgetFormValues) => {
    onSetBudget(data);
    // Optionally reset parts of the form or provide feedback
    // reset({ categoryId: '', amount: undefined, monthYear: currentMonthYear }); 
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget Goal</CardTitle>
        <CardDescription>Define your monthly spending limit for each category.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={categories.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={categories.length > 0 ? "Select category" : "No categories"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="monthYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month/Year</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount ($)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.01" placeholder="e.g., 500" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Set/Update Budget
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
