"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface MCQReaderProps {
  questions: Question[];
  title?: string;
}

export default function MCQReader({
  questions,
  title = "Multiple Choice Questions",
}: MCQReaderProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-md font-semibold">{title}</h1>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-answers"
            checked={showAnswers}
            onCheckedChange={setShowAnswers}
          />
          <Label htmlFor="show-answers">Show Answers</Label>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {index + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={cn(
                      "p-3 rounded-md border",
                      showAnswers && option === question.answer
                        ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800"
                        : "bg-card hover:bg-accent/50"
                    )}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
