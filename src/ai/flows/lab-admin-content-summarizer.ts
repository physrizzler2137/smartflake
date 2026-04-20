'use server';
/**
 * @fileOverview An AI tool to generate concise summaries for research projects, publication abstracts, or team member bios from longer descriptions.
 *
 * - summarizeContent - A function that handles the content summarization process.
 * - SummarizeContentInput - The input type for the summarizeContent function.
 * - SummarizeContentOutput - The return type for the summarizeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeContentInputSchema = z.object({
  textToSummarize: z.string().describe('The longer text content to be summarized.'),
});
export type SummarizeContentInput = z.infer<typeof SummarizeContentInputSchema>;

const SummarizeContentOutputSchema = z.object({
  summary: z.string().describe('A concise and engaging summary of the provided text.'),
});
export type SummarizeContentOutput = z.infer<typeof SummarizeContentOutputSchema>;

export async function summarizeContent(input: SummarizeContentInput): Promise<SummarizeContentOutput> {
  return summarizeContentFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: { schema: SummarizeContentInputSchema },
  output: { schema: SummarizeContentOutputSchema },
  prompt: `You are an AI assistant tasked with generating concise and engaging summaries for website content. Your goal is to distill longer descriptions into informative and easy-to-read content for various purposes such as research projects, publication abstracts, or team member bios.

Summarize the following text:

Text to summarize: {{{textToSummarize}}}

Please ensure the summary is concise, engaging, and accurately reflects the core information of the original text.`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeContentPrompt(input);
    return output!;
  }
);
