
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Wand2, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import type { Transaction, Category } from "@/types";
import { autoCategorizeExpense, type AutoCategorizeExpenseInput } from "@/ai/flows/auto-categorize-expense";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";

const expenseFormSchema = z.object({
  vendor: z.string().min(1, { message: "Vendor is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  date: z.date({ required_error: "Date is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction; 
}

export function ExpenseForm({ categories, onSubmit, initialData }: ExpenseFormProps) {
  const { toast } = useToast();
  const { selectedCurrency } = useCurrency();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<{ category: string, confidence: number } | null>(null);
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: new Date(initialData.date),
      amount: initialData.amount
    } : {
      vendor: "",
      amount: undefined,
      date: new Date(),
      categoryId: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        date: new Date(initialData.date),
        amount: initialData.amount
      });
    } else {
       form.reset({ vendor: "", amount: undefined, date: new Date(), categoryId: "", description: "" });
    }
  }, [initialData, form]);

  const handleFormSubmit = (data: ExpenseFormValues) => {
    onSubmit({ ...data, date: data.date.toISOString().split('T')[0] });
    form.reset({ vendor: "", amount: undefined, date: new Date(), categoryId: "", description: "" });
    setSuggestedCategory(null);
    toast({ title: "Success", description: `Expense ${initialData ? 'updated' : 'added'} successfully.` });
  };

  const handleSuggestCategory = async () => {
    const vendor = form.getValues("vendor");
    const amount = form.getValues("amount");

    if (!vendor || !amount || amount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a vendor and a valid amount to suggest a category.",
        variant: "destructive",
      });
      return;
    }

    setIsSuggesting(true);
    setSuggestedCategory(null);
    try {
      const input: AutoCategorizeExpenseInput = { vendor, amount, description: form.getValues("description") };
      const result = await autoCategorizeExpense(input);
      
      const matchedCategory = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
      
      if (matchedCategory) {
        form.setValue("categoryId", matchedCategory.id, { shouldValidate: true });
        toast({
          title: "Category Suggested!",
          description: `AI suggested: ${result.category} (Confidence: ${(result.confidence * 100).toFixed(0)}%). Category set.`,
        });
      } else {
         toast({
          title: "Category Suggested",
          description: `AI suggested: ${result.category} (Confidence: ${(result.confidence * 100).toFixed(0)}%). Please select a matching category or add a new one.`,
        });
      }
      setSuggestedCategory(result);

    } catch (error) {
      console.error("AI Category Suggestion Error:", error);
      toast({
        title: "Suggestion Failed",
        description: "Could not get AI category suggestion. Please categorize manually.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Expense" : "Add New Expense"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the details of your expense." : "Fill in the details for your new expense."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Starbucks, Amazon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ({selectedCurrency})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 25.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={field.onChange} value={field.value} disabled={categories.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={categories.length > 0 ? "Select a category" : "No categories available"} />
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
                      <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategory} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        <span className="sr-only">Suggest Category</span>
                      </Button>
                    </div>
                     {suggestedCategory && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        AI suggested: {suggestedCategory.category} ({(suggestedCategory.confidence * 100).toFixed(0)}% confident)
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Coffee with client, Birthday gift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Expense" : "Add Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
