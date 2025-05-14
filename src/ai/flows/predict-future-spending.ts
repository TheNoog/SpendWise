// src/ai/flows/predict-future-spending.ts
'use server';
/**
 * @fileOverview Predicts future spending based on historical transaction data.
 *
 * - predictFutureSpending - Predicts future spending trends.
 * - PredictFutureSpendingInput - The input type for the predictFutureSpending function.
 * - PredictFutureSpendingOutput - The return type for the predictFutureSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureSpendingInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe(
      'A string containing the transaction history data, including dates, amounts, and categories.'
    ),
  predictionTimeframe: z
    .string()
    .describe(
      'The timeframe for which to predict future spending (e.g., weekly, monthly).'
    ),
});
export type PredictFutureSpendingInput = z.infer<
  typeof PredictFutureSpendingInputSchema
>;

const PredictFutureSpendingOutputSchema = z.object({
  predictedSpending: z
    .string()
    .describe('A prediction of future spending, with explanations.'),
  potentialSavings: z
    .string()
    .describe(
      'Suggestions for potential savings or adjustments to avoid overspending.'
    ),
});
export type PredictFutureSpendingOutput = z.infer<
  typeof PredictFutureSpendingOutputSchema
>;

export async function predictFutureSpending(
  input: PredictFutureSpendingInput
): Promise<PredictFutureSpendingOutput> {
  return predictFutureSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureSpendingPrompt',
  input: {schema: PredictFutureSpendingInputSchema},
  output: {schema: PredictFutureSpendingOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's transaction history and
  predict their future spending for the specified timeframe. Also, provide potential
  savings or adjustments to help them avoid overspending.

  Transaction History:
  {{transactionHistory}}

  Prediction Timeframe:
  {{predictionTimeframe}}

  Based on this information, provide a predicted spending amount and advice on how to save money.
  Ensure that the prediction and advice are clear and actionable.
  `,
});

const predictFutureSpendingFlow = ai.defineFlow(
  {
    name: 'predictFutureSpendingFlow',
    inputSchema: PredictFutureSpendingInputSchema,
    outputSchema: PredictFutureSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
