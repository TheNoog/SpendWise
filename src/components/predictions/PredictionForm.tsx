
"use client";

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAppContext } from '@/hooks/useAppContext';
import { predictFutureSpending, PredictFutureSpendingInput, PredictFutureSpendingOutput } from '@/ai/flows/predict-future-spending';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, WandSparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const predictionFormSchema = z.object({
  customTransactionHistory: z.string().optional(),
  predictionTimeframe: z.enum(["weekly", "monthly", "quarterly"], { required_error: "Prediction timeframe is required." }),
});

type PredictionFormValues = z.infer<typeof predictionFormSchema>;

export function PredictionForm() {
  const { state, getCategoryById } = useAppContext();
  const { transactions } = state;
  const [predictionResult, setPredictionResult] = useState<PredictFutureSpendingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      predictionTimeframe: "monthly",
    },
  });

  const formatTransactionHistory = (): string => {
    if (transactions.length === 0) {
      return "No transaction history available.";
    }
    return transactions
      .slice(0, 50) // Limit to last 50 transactions for brevity
      .map(t => {
        const category = getCategoryById(t.categoryId);
        return `Date: ${t.date.toISOString().split('T')[0]}, Type: ${t.type}, Amount: ${t.amount.toFixed(2)}, Category: ${category?.name || 'N/A'}, Description: ${t.description || 'N/A'}`;
      })
      .join('; ');
  };

  const onSubmit = async (data: PredictionFormValues) => {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const transactionHistory = data.customTransactionHistory || formatTransactionHistory();
      if (!transactionHistory || transactionHistory === "No transaction history available.") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No transaction data available to make a prediction. Please add some transactions or provide custom history.",
        });
        setIsLoading(false);
        return;
      }

      const input: PredictFutureSpendingInput = {
        transactionHistory,
        predictionTimeframe: data.predictionTimeframe,
      };
      const result = await predictFutureSpending(input);
      setPredictionResult(result);
      toast({
        title: "Prediction Ready!",
        description: "AI has generated spending predictions.",
      });
    } catch (error) {
      console.error("Error predicting spending:", error);
      toast({
        variant: "destructive",
        title: "Prediction Error",
        description: "Could not generate prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>AI Spending Predictor</CardTitle>
              <CardDescription>
                Let AI analyze your spending habits and predict future trends. 
                By default, it uses your last 50 transactions. You can also provide custom data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="predictionTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prediction Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customTransactionHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Transaction History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste transaction data here, or leave blank to use your app data. E.g., Date: YYYY-MM-DD, Type: expense, Amount: 50, Category: Groceries; ..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="mr-2 h-4 w-4" />
                )}
                Predict Spending
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Alert>
          <BrainCircuit className="h-5 w-5" />
          <AlertTitle>Generating Prediction...</AlertTitle>
          <AlertDescription>
            Our AI is analyzing the data. This might take a few moments.
          </AlertDescription>
        </Alert>
      )}

      {predictionResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="border-primary">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">Predicted Spending</AlertTitle>
              <AlertDescription>
                {predictionResult.predictedSpending}
              </AlertDescription>
            </Alert>
            <Alert variant="default" className="border-accent">
               <WandSparkles className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent">Potential Savings & Advice</AlertTitle>
              <AlertDescription>
                {predictionResult.potentialSavings}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
