"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseListTable } from "@/components/expenses/ExpenseListTable";
import { CategoryManagerDialog } from "@/components/expenses/CategoryManagerDialog";
import { Button } from "@/components/ui/button";
import { Tags, CreditCard, PlusCircle } from "lucide-react";
import type { Transaction, Category } from "@/types";
import { initialTransactions, initialCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const { toast } = useToast();

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setEditingTransaction(undefined); // Clear editing state
  };

  const handleUpdateTransaction = (data: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? {...editingTransaction, ...data} : t));
    setEditingTransaction(undefined);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(txn => txn.id !== transactionId));
    toast({ title: "Expense Deleted", description: "The expense has been removed." });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    // Scroll to form or open in a dialog would be good UX here. For now, form re-populates.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Category Management Handlers
  const handleAddCategory = (newCategoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = { 
      ...newCategoryData, 
      id: `cat-${Date.now()}-${Math.random().toString(16).slice(2)}` 
    };
    setCategories(prev => [...prev, newCategory]);
    toast({ title: "Category Added", description: `Category "${newCategory.name}" created.` });
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    toast({ title: "Category Updated", description: `Category "${updatedCategory.name}" saved.` });
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category is used in transactions
    const isUsed = transactions.some(txn => txn.categoryId === categoryId);
    if (isUsed) {
      toast({ 
        title: "Cannot Delete Category", 
        description: "This category is being used by one or more transactions. Please reassign them first.",
        variant: "destructive",
      });
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({ title: "Category Deleted", description: "The category has been removed." });
  };


  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Manage Expenses" 
        description="Track and categorize your spending."
        icon={CreditCard}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsCategoryManagerOpen(true)}>
              <Tags className="mr-2 h-4 w-4" /> Manage Categories
            </Button>
            {!editingTransaction && (
                 <Button onClick={() => setEditingTransaction(undefined)}> {/* Clears form for new entry */}
                   <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
                 </Button>
            )}
             {editingTransaction && (
                 <Button variant="outline" onClick={() => setEditingTransaction(undefined)}> 
                   Cancel Edit & Add New
                 </Button>
            )}
          </>
        }
      />
      
      <div className="mb-8">
        <ExpenseForm 
          categories={categories} 
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          initialData={editingTransaction}
        />
      </div>

      <ExpenseListTable 
        transactions={transactions} 
        categories={categories} 
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      <CategoryManagerDialog
        isOpen={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
