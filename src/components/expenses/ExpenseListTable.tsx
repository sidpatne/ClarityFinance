"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import type { Transaction, Category } from "@/types";
import { CategoryIcon } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenseListTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export function ExpenseListTable({ transactions, categories, onEdit, onDelete }: ExpenseListTableProps) {
  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
        <CardDescription>A detailed list of all your recorded expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length > 0 ? sortedTransactions.map((txn) => {
              const category = getCategory(txn.categoryId);
              return (
                <TableRow key={txn.id}>
                  <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{txn.vendor}</div>
                    {txn.description && <div className="text-xs text-muted-foreground">{txn.description}</div>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {category ? (
                      <div className="flex items-center gap-2">
                        <CategoryIcon name={category.iconName} className="h-4 w-4 text-muted-foreground" />
                        {category.name}
                      </div>
                    ) : (
                      "Uncategorized"
                    )}
                  </TableCell>
                  <TableCell className="text-right">${txn.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(txn)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(txn.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            }) : (
               <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No expenses recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
