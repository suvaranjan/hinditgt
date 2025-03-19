"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import syllabusData from "@/data/syllabusv2.json"; // Updated import
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import TestResults from "@/components/test-results";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type Topic = {
  name: string;
  author: string;
  bookLink: string | null;
  questions: Question[];
};

type Subject = {
  subject: string;
  topics: Topic[];
};

function TestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject = searchParams.get("subject") || "All";
  const topic = searchParams.get("topic") || "All";
  const numberOfQuestionsParam = searchParams.get("numberOfQuestions") || "20";
  const timerParam = searchParams.get("timer") || "20";

  const numberOfQuestions = Number.parseInt(numberOfQuestionsParam);
  const timerMinutes = Number.parseInt(timerParam);

  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
  });

  // Filter questions based on subject and topic
  useEffect(() => {
    let questions: Question[] = [];

    syllabusData.syllabus.forEach((subjectData: Subject) => {
      if (subject === "All" || subjectData.subject === subject) {
        subjectData.topics.forEach((topicData: Topic) => {
          if (topic === "All" || topicData.name === topic) {
            questions = [...questions, ...topicData.questions];
          }
        });
      }
    });

    // Limit to the number of questions specified
    const limitedQuestions = questions.slice(0, numberOfQuestions);
    setFilteredQuestions(limitedQuestions);

    // Initialize user answers array with empty strings
    setUserAnswers(new Array(limitedQuestions.length).fill(""));
  }, [subject, topic, numberOfQuestions]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to a specific question
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Calculate progress percentage
  const progressPercentage =
    ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  // Submit test
  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    filteredQuestions.forEach((question, index) => {
      if (userAnswers[index] === "") {
        unattempted++;
      } else if (userAnswers[index] === question.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setScore({ correct, incorrect, unattempted });
    setIsTestSubmitted(true);
  };

  // Return to test form
  const handleReturnToForm = () => {
    router.push("/");
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>
              No questions found for the selected subject and topic.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleReturnToForm} className="w-full">
              Return to Test Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!isTestSubmitted ? (
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-lg mb-1">
                  {subject !== "All" ? subject : "All Subjects"} -
                  {topic !== "All" ? ` ${topic}` : " All Topics"}
                </CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of{" "}
                  {filteredQuestions.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardHeader>

          <CardContent className="pt-2">
            {/* Current question */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                {currentQuestionIndex + 1}.{" "}
                {filteredQuestions[currentQuestionIndex]?.question}
              </h3>
              <RadioGroup
                value={userAnswers[currentQuestionIndex]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {filteredQuestions[currentQuestionIndex]?.options.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${optionIndex}`}
                      />
                      <Label
                        htmlFor={`option-${optionIndex}`}
                        className="flex-grow cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <div className="flex justify-between items-center border-t pt-6 w-full mb-5">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 gap-1 dark:text-white"
                onClick={handleSubmit}
                disabled={!userAnswers.some((answer) => answer !== "")} // Disabled if no question attempted
              >
                Submit Test
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === filteredQuestions.length - 1}
              >
                Next
              </Button>
            </div>

            {/* Question navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={userAnswers[index] ? "default" : "outline"}
                  size="sm"
                  className={`w-10 h-10 p-0 ${
                    currentQuestionIndex === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <TestResults
          subject={subject}
          topic={topic}
          score={score}
          filteredQuestions={filteredQuestions}
          userAnswers={userAnswers}
          handleReturnToForm={handleReturnToForm}
        />
      )}
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestContent />
    </Suspense>
  );
}
