
"use client";

import { DollarSign, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { useAppContext } from '@/hooks/useAppContext';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import type { Category } from '@/types';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

// Helper to generate random colors for pie chart if not defined in category
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


export default function DashboardPage() {
  const { state } = useAppContext();
  const { transactions, categories, budgetGoals } = state;

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, netBalance };
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const spendingMap = new Map<string, { name: string; value: number; color?: string }>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const category = categories.find((c) => c.id === t.categoryId);
        const categoryName = category ? category.name : 'Uncategorized';
        const categoryColor = category?.color || getRandomColor();
        spendingMap.set(
          categoryName,
          {
            name: categoryName,
            value: (spendingMap.get(categoryName)?.value || 0) + t.amount,
            color: categoryColor
          }
        );
      });
    return Array.from(spendingMap.values());
  }, [transactions, categories]);

  const incomeVsExpenseByMonth = useMemo(() => {
    const monthlyData: { [key: string]: { month: string; income: number; expenses: number } } = {};
    transactions.forEach(t => {
      const month = t.date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === 'income') monthlyData[month].income += t.amount;
      else monthlyData[month].expenses += t.amount;
    });
    return Object.values(monthlyData).sort((a, b) => new Date(`01 ${a.month.split(' ')[0]} 20${a.month.split(' ')[1]}`) .getTime() - new Date(`01 ${b.month.split(' ')[0]} 20${b.month.split(' ')[1]}`).getTime());
  }, [transactions]);
  
  const chartConfig = {
    expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
    income: { label: "Income", color: "hsl(var(--primary))" },
  };
  spendingByCategory.forEach(item => {
    // @ts-ignore
    chartConfig[item.name] = { label: item.name, color: item.color || getRandomColor() };
  });


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Income"
          value={`$${summary.totalIncome.toFixed(2)}`}
          icon={TrendingUp}
          iconClassName="text-green-500"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toFixed(2)}`}
          icon={TrendingDown}
          iconClassName="text-red-500"
        />
        <SummaryCard
          title="Net Balance"
          value={`$${summary.netBalance.toFixed(2)}`}
          icon={DollarSign}
          iconClassName={summary.netBalance >= 0 ? "text-accent" : "text-destructive"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Overview of your expenses across different categories.</CardDescription>
          </CardHeader>
          <CardContent>
            {spendingByCategory.length > 0 ? (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                  <Pie data={spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {spendingByCategory.map((entry, index) => (
                       // @ts-ignore
                      <Cell key={`cell-${index}`} fill={entry.color || chartConfig[entry.name]?.color || getRandomColor()} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No expense data available to display chart.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>Monthly comparison of your income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
           {incomeVsExpenseByMonth.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={incomeVsExpenseByMonth}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
             ) : (
              <p className="text-center text-muted-foreground py-8">No transaction data available to display chart.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Budget Goals</CardTitle>
          <CardDescription>Track your progress towards your financial goals.</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetGoals.length > 0 ? (
            <ul className="space-y-4">
              {budgetGoals.slice(0, 3).map(goal => {
                const category = categories.find(c => c.id === goal.categoryId);
                // Basic progress calculation placeholder
                const spent = transactions
                  .filter(t => t.type === 'expense' && t.categoryId === goal.categoryId && t.date >= goal.startDate && (!goal.endDate || t.date <= goal.endDate))
                  .reduce((sum, t) => sum + t.amount, 0);
                const progress = Math.min((spent / goal.amount) * 100, 100);
                const remaining = goal.amount - spent;
                return (
                  <li key={goal.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{goal.name} {category ? `(${category.name})` : '(Overall)'}</span>
                      <span className="text-sm text-muted-foreground">${spent.toFixed(2)} / ${goal.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} overspent`}
                    </p>
                  </li>
                );
              })}
              {budgetGoals.length > 3 && <p className="text-sm text-center text-muted-foreground mt-2">And {budgetGoals.length - 3} more goals...</p>}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No budget goals set</h3>
              <p className="mt-1 text-sm text-muted-foreground">Start by creating a new budget goal.</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/budgets">Create Budget</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

       {transactions.length === 0 && categories.length === DEFAULT_CATEGORIES.length && (
         <Card className="shadow-lg bg-secondary/50 border-secondary">
            <CardHeader className="flex flex-row items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-secondary-foreground" />
              <div>
                <CardTitle className="text-secondary-foreground">Get Started with SpendWise!</CardTitle>
                <CardDescription className="text-secondary-foreground/80">
                  Add your first transaction or customize categories to begin tracking your finances.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link href="/transactions">Add Transaction</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/categories">Manage Categories</Link>
              </Button>
            </CardContent>
         </Card>
       )}

    </div>
  );
}
