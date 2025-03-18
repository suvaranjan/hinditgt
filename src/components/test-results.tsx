"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type Score = {
  correct: number;
  incorrect: number;
  unattempted: number;
};

type TestResultsProps = {
  subject: string;
  topic: string;
  score: Score;
  filteredQuestions: Question[];
  userAnswers: string[];
  handleReturnToForm: () => void;
};

export default function TestResults({
  subject,
  topic,
  score,
  filteredQuestions,
  userAnswers,
  handleReturnToForm,
}: TestResultsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Test Results</CardTitle>
        <CardDescription>
          {subject !== "All" ? subject : "All Subjects"} -
          {topic !== "All" ? ` ${topic}` : " All Topics"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Correct Answers</p>
                <p className="text-2xl font-bold">{score.correct}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Incorrect Answers</p>
                <p className="text-2xl font-bold">{score.incorrect}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Unattempted</p>
                <p className="text-2xl font-bold">{score.unattempted}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertTitle>Score Summary</AlertTitle>
          <AlertDescription>
            You scored {score.correct} out of {filteredQuestions.length} (
            {Math.round((score.correct / filteredQuestions.length) * 100)}%)
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <h3 className="text-xl font-medium">Question Review</h3>
          {filteredQuestions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Question {index + 1}</h4>
                {userAnswers[index] === question.answer ? (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    Correct
                  </Badge>
                ) : userAnswers[index] === "" ? (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    Unattempted
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  >
                    Incorrect
                  </Badge>
                )}
              </div>
              <p>{question.question}</p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded-md ${
                      option === question.answer
                        ? "bg-green-100 dark:bg-green-900/30"
                        : option === userAnswers[index] &&
                          option !== question.answer
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    {option}
                    {option === question.answer && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        (Correct Answer)
                      </span>
                    )}
                    {option === userAnswers[index] &&
                      option !== question.answer && (
                        <span className="ml-2 text-red-600 dark:text-red-400">
                          (Your Answer)
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleReturnToForm} className="w-full">
          Return to Test Form
        </Button>
      </CardFooter>
    </Card>
  );
}
