"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { generateSummaryAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate Summary"}
    </Button>
  );
}

export default function SummarizerPage() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useFormState(generateSummaryAction, initialState);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/#contact">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Main Site
            </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="font-headline">AI Content Summarizer</CardTitle>
                <CardDescription>
                  Generate concise summaries for research projects, abstracts, or bios.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textToSummarize">Text to Summarize</Label>
                <Textarea
                  id="textToSummarize"
                  name="textToSummarize"
                  placeholder="Paste your long-form text here... It should be at least 50 characters long."
                  rows={10}
                  required
                />
              </div>
              {state.message && state.message !== "success" && (
                  <p className="text-sm text-destructive">{state.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <SubmitButton />
            </CardFooter>
          </form>

          {state.summary && (
            <div className="p-6 pt-0">
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold font-headline mb-2">Generated Summary:</h3>
                    <div className="prose prose-invert rounded-md border bg-muted/50 p-4 text-sm">
                        <p>{state.summary}</p>
                    </div>
                </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
