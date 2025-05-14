
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAppContext } from "@/hooks/useAppContext";
import type { Transaction, TransactionType, Frequency } from "@/types";
import { TRANSACTION_FREQUENCIES } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  date: z.date({ required_error: "Date is required." }),
  description: z.string().optional(),
  frequency: z.enum(TRANSACTION_FREQUENCIES.map(f => f.value) as [Frequency, ...Frequency[]], { required_error: "Frequency is required."}),
  endDate: z.date().optional(),
}).refine(data => !(data.frequency !== 'once' && !data.endDate), {
  message: "End date is required for recurring transactions.",
  path: ["endDate"],
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onFormSubmit?: () => void;
}

export function TransactionForm({ transaction, onFormSubmit }: TransactionFormProps) {
  const { state, addTransaction, updateTransaction } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction ? {
      ...transaction,
      date: new Date(transaction.date),
      endDate: transaction.endDate ? new Date(transaction.endDate) : undefined,
    } : {
      type: "expense",
      amount: 0,
      date: new Date(),
      frequency: "once",
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        ...transaction,
        date: new Date(transaction.date),
        endDate: transaction.endDate ? new Date(transaction.endDate) : undefined,
      });
    } else {
      form.reset({
        type: "expense",
        amount: 0,
        date: new Date(),
        frequency: "once",
        description: "",
        categoryId: "",
        endDate: undefined,
      });
    }
  }, [transaction, form, isOpen]);


  const onSubmit = (data: TransactionFormValues) => {
    if (transaction) {
      updateTransaction({ ...transaction, ...data });
    } else {
      addTransaction(data);
    }
    form.reset();
    setIsOpen(false);
    onFormSubmit?.();
  };

  const selectedType = form.watch("type");
  const availableCategories = state.categories.filter(c => c.type === selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {transaction ? (
          <Button variant="ghost" size="sm">Edit</Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit" : "Add"} Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2 pr-1 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_FREQUENCIES.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("frequency") !== "once" && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (for recurring)</FormLabel>
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
                              <span>Pick an end date</span>
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
                          disabled={(date) => date < form.getValues("date")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Weekly groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {transaction ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
