"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Transaction, Category } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/icons";

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
}

export function RecentTransactionsTable({ transactions, categories, limit = 5 }: RecentTransactionsTableProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || "Uncategorized";
  };
   const getCategoryIconName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.iconName || "HelpCircle";
  };

  const displayedTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activities.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/expenses">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTransactions.length > 0 ? displayedTransactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>
                  <div className="font-medium">{txn.vendor}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {new Date(txn.date).toLocaleDateString()} - {getCategoryName(txn.categoryId)}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={getCategoryIconName(txn.categoryId)} className="h-4 w-4 text-muted-foreground" />
                    {getCategoryName(txn.categoryId)}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(txn.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  ${txn.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
