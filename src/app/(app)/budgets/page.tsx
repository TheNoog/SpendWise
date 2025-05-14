
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit3, Trash2, Target, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BudgetGoal, BudgetPeriod } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { BUDGET_PERIODS } from "@/lib/constants";

const budgetFormSchema = z.object({
  name: z.string().min(1, { message: "Budget name is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  categoryId: z.string().optional(),
  period: z.enum(BUDGET_PERIODS.map(p => p.value) as [BudgetPeriod, ...BudgetPeriod[]], { required_error: "Period is required."}),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date().optional(),
}).refine(data => !(data.period === 'custom' && !data.endDate), {
  message: "End date is required for custom period budgets.",
  path: ["endDate"],
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormDialogProps {
  budgetGoal?: BudgetGoal;
  onFormSubmit?: () => void;
  triggerButton?: React.ReactNode;
}

function BudgetFormDialog({ budgetGoal, onFormSubmit, triggerButton }: BudgetFormDialogProps) {
  const { state, addBudgetGoal, updateBudgetGoal } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: budgetGoal 
    ? { ...budgetGoal, startDate: new Date(budgetGoal.startDate), endDate: budgetGoal.endDate ? new Date(budgetGoal.endDate) : undefined } 
    : { name: "", amount: 0, period: "monthly", startDate: new Date() },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(budgetGoal 
        ? { ...budgetGoal, startDate: new Date(budgetGoal.startDate), endDate: budgetGoal.endDate ? new Date(budgetGoal.endDate) : undefined } 
        : { name: "", amount: 0, period: "monthly", startDate: new Date(), categoryId: undefined, endDate: undefined }
      );
    }
  }, [budgetGoal, form, isOpen]);

  const onSubmit = (data: BudgetFormValues) => {
    const payload = { ...data };
    if (data.period !== 'custom' && data.endDate) {
        delete payload.endDate; // Remove endDate if not custom period
    }

    if (budgetGoal) {
      updateBudgetGoal({ ...budgetGoal, ...payload });
    } else {
      addBudgetGoal(payload);
    }
    setIsOpen(false);
    onFormSubmit?.();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Budget Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{budgetGoal ? "Edit" : "Add"} Budget Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pr-1 max-h-[70vh] overflow-y-auto">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Budget Name</FormLabel><FormControl><Input placeholder="e.g., Monthly Groceries Budget" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Overall budget or select category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="">Overall Budget</SelectItem>
                      {state.categories.filter(c => c.type === 'expense').map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="period" render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {BUDGET_PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover><FormMessage />
                </FormItem>
            )}/>
            {form.watch("period") === "custom" && (
              <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>End Date (for custom period)</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick an end date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button></FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues("startDate")} initialFocus />
                      </PopoverContent>
                    </Popover><FormMessage />
                  </FormItem>
              )}/>
            )}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">{budgetGoal ? "Save Changes" : "Add Budget Goal"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function BudgetsPage() {
  const { state, deleteBudgetGoal, getCategoryById } = useAppContext();
  const { budgetGoals, transactions } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budget Goals</h1>
        <BudgetFormDialog />
      </div>

      {budgetGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center h-[400px]">
          <Target className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No budget goals set</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create budget goals to track your spending and savings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetGoals.map((goal) => {
            const category = goal.categoryId ? getCategoryById(goal.categoryId) : null;
            
            // Simplified progress calculation (assumes expenses within period)
            // This should be more robust in a real app, considering budget period (weekly, monthly, etc)
            const relevantTransactions = transactions.filter(t => 
                t.type === 'expense' &&
                (!goal.categoryId || t.categoryId === goal.categoryId) &&
                new Date(t.date) >= new Date(goal.startDate) &&
                (!goal.endDate || new Date(t.date) <= new Date(goal.endDate))
            );
            const spentAmount = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
            const progress = Math.min((spentAmount / goal.amount) * 100, 100);
            const remaining = goal.amount - spentAmount;

            return (
              <Card key={goal.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>
                        {category ? category.name : "Overall"} | {goal.period}
                      </CardDescription>
                    </div>
                    <Target className="w-6 h-6 text-primary"/>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spent: ${spentAmount.toFixed(2)}</span>
                      <span>Budget: ${goal.amount.toFixed(2)}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  <p className={`text-sm font-medium ${remaining >=0 ? 'text-accent' : 'text-destructive'}`}>
                    {remaining >=0 ? `$${remaining.toFixed(2)} Remaining` : `$${Math.abs(remaining).toFixed(2)} Overspent`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Starts: {format(new Date(goal.startDate), "MMM dd, yyyy")}
                    {goal.endDate && ` - Ends: ${format(new Date(goal.endDate), "MMM dd, yyyy")}`}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                   <BudgetFormDialog budgetGoal={goal} triggerButton={
                     <Button variant="ghost" size="sm"><Edit3 className="w-4 h-4 mr-1" /> Edit</Button>
                   }/>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                         <Trash2 className="w-4 h-4 mr-1" /> Delete
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this budget goal.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteBudgetGoal(goal.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

