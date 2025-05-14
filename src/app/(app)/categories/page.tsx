
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, AlertTriangle } from "lucide-react";
import * as LucideIcons from "lucide-react"; // Import all icons
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category, TransactionType } from "@/types";
import React, { useState, useEffect } from "react";
import { LUCIDE_ICON_NAMES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Category name is required." }),
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  icon: z.string().optional(),
  color: z.string().optional().refine(val => !val || /^hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)$/i.test(val), {
    message: "Color must be a valid HSL string (e.g., hsl(120, 60%, 50%))"
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormDialogProps {
  category?: Category;
  onFormSubmit?: () => void;
  triggerButton?: React.ReactNode;
}

function CategoryFormDialog({ category, onFormSubmit, triggerButton }: CategoryFormDialogProps) {
  const { addCategory, updateCategory } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category || { type: "expense", name: "", icon: "Shapes", color: "hsl(0, 0%, 50%)" },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(category || { type: "expense", name: "", icon: "Shapes", color: "hsl(0, 0%, 50%)" });
    }
  }, [category, form, isOpen]);

  const onSubmit = (data: CategoryFormValues) => {
    if (category) {
      updateCategory({ ...category, ...data });
    } else {
      addCategory(data);
    }
    setIsOpen(false);
    onFormSubmit?.();
  };

  // @ts-ignore
  const IconComponent = LucideIcons[form.watch("icon") || "Shapes"] || LucideIcons.Shapes;


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Add"} Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pr-1 max-h-[70vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Groceries" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">Icon (Optional) <IconComponent className="w-4 h-4" /></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <ScrollArea className="h-60">
                      {LUCIDE_ICON_NAMES.map(iconName => {
                        // @ts-ignore
                        const CurrentIcon = LucideIcons[iconName];
                        return (
                           <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                               {CurrentIcon && <CurrentIcon className="w-4 h-4" />} {iconName}
                            </div>
                           </SelectItem>
                        );
                      })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">Color (HSL Format, Optional) 
                    {field.value && <span className="w-4 h-4 rounded-full inline-block" style={{backgroundColor: field.value}}/>}
                  </FormLabel>
                  <FormControl><Input placeholder="e.g., hsl(120, 60%, 50%)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">{category ? "Save Changes" : "Add Category"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function CategoriesPage() {
  const { state, deleteCategory } = useAppContext();
  const { categories } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <CategoryFormDialog />
      </div>

      {categories.length === 0 ? (
         <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center h-[400px]">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No categories found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
            Create categories to organize your income and expenses.
            </p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            // @ts-ignore
            const Icon = LucideIcons[category.icon || "Shapes"] || LucideIcons.Shapes;
            return (
            <Card key={category.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-6 h-6" style={{color: category.color || 'hsl(var(--foreground))'}} />
                    {category.name}
                  </CardTitle>
                   <Badge variant={category.type === 'income' ? 'default' : 'secondary'} className={category.type === 'income' ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}>
                     {category.type}
                   </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end gap-2">
                <CategoryFormDialog category={category} triggerButton={
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
                        Deleting this category will not delete associated transactions, but they will become uncategorized. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
