"use server";

import { z } from "zod";
import { summarizeContent, SummarizeContentOutput } from "@/ai/flows/lab-admin-content-summarizer";

const schema = z.object({
  textToSummarize: z.string().min(50, { message: "Text to summarize must be at least 50 characters." }),
});

export type FormState = {
  message: string;
  summary?: string;
};

export async function generateSummaryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  
  const validatedFields = schema.safeParse({
    textToSummarize: formData.get("textToSummarize"),
  });

  if (!validatedFields.success) {
    return {
      message: "Error: Please provide valid text to summarize.",
    };
  }
  
  try {
    const result: SummarizeContentOutput = await summarizeContent(validatedFields.data);
    return { message: "success", summary: result.summary };
  } catch (e) {
    console.error(e);
    return { message: "An error occurred while generating the summary." };
  }
}
