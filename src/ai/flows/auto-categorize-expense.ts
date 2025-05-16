// This is an auto-generated file from Firebase Studio.
'use server';
/**
 * @fileOverview An AI agent that suggests expense categories for uncategorized transactions.
 *
 * - autoCategorizeExpense - A function that suggests expense categories for a given transaction.
 * - AutoCategorizeExpenseInput - The input type for the autoCategorizeExpense function.
 * - AutoCategorizeExpenseOutput - The return type for the autoCategorizeExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeExpenseInputSchema = z.object({
  vendor: z.string().describe('The name of the vendor for the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
  description: z.string().optional().describe('Optional description of the transaction.'),
});
export type AutoCategorizeExpenseInput = z.infer<typeof AutoCategorizeExpenseInputSchema>;

const AutoCategorizeExpenseOutputSchema = z.object({
  category: z.string().describe('The suggested category for the expense.'),
  confidence: z.number().describe('A confidence score between 0 and 1 indicating the certainty of the category suggestion.'),
});
export type AutoCategorizeExpenseOutput = z.infer<typeof AutoCategorizeExpenseOutputSchema>;

export async function autoCategorizeExpense(input: AutoCategorizeExpenseInput): Promise<AutoCategorizeExpenseOutput> {
  return autoCategorizeExpenseFlow(input);
}

const autoCategorizeExpensePrompt = ai.definePrompt({
  name: 'autoCategorizeExpensePrompt',
  input: {schema: AutoCategorizeExpenseInputSchema},
  output: {schema: AutoCategorizeExpenseOutputSchema},
  prompt: `You are an expert in personal finance and expense categorization.

  Given the following transaction details, suggest the most appropriate expense category.
  Also, provide a confidence score (between 0 and 1) indicating how certain you are about the suggestion.

  Vendor: {{{vendor}}}
  Amount: {{{amount}}}
  Description: {{{description}}}

  Respond in JSON format.
  `,
});

const autoCategorizeExpenseFlow = ai.defineFlow(
  {
    name: 'autoCategorizeExpenseFlow',
    inputSchema: AutoCategorizeExpenseInputSchema,
    outputSchema: AutoCategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await autoCategorizeExpensePrompt(input);
    return output!;
  }
);
