
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/hooks/useAppContext";
import { format } from "date-fns";
import type { Transaction } from "@/types";
import { TransactionForm } from "./TransactionForm";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TransactionTable() {
  const { state, deleteTransaction, getCategoryById } = useAppContext();
  const { transactions } = state;

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center h-[400px]">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No transactions yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first income or expense to see it listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right w-[100px]">Amount</TableHead>
            <TableHead className="text-center w-[100px]">Type</TableHead>
            <TableHead className="text-right w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.sort((a,b) => b.date.getTime() - a.date.getTime()).map((transaction: Transaction) => {
            const category = getCategoryById(transaction.categoryId);
            return (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                <TableCell className="font-medium">{transaction.description || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline" style={{borderColor: category?.color, color: category?.color}}>
                    {category?.name || "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-accent' : 'text-destructive'}`}>
                  {transaction.type === 'income' ? '+' : '-'} ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {transaction.type === 'income' ? 
                    <ArrowUpCircle className="h-5 w-5 text-accent mx-auto" /> : 
                    <ArrowDownCircle className="h-5 w-5 text-destructive mx-auto" />}
                </TableCell>
                <TableCell className="text-right">
                  <TransactionForm transaction={transaction} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this transaction.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTransaction(transaction.id)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
