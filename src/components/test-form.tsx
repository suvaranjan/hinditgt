"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import syllabusData from "@/data/syllabus.json";
import questionData from "@/data/mcqs/question.json";
import { useRouter } from "next/navigation";

const syllabusSubjects = new Set(syllabusData.map((item) => item.subject));
const questionSubjects = new Set(questionData.map((item) => item.subject));
const availableSubjects = Array.from(
  new Set(
    [...syllabusSubjects].filter((subject) => questionSubjects.has(subject))
  )
);

const questionTopics = new Set(questionData.flatMap((item) => item.topic));

const formSchema = z.object({
  subject: z.string({ required_error: "Please select a subject" }),
  topic: z.string().optional(),
  numberOfQuestions: z.number().min(1),
  timer: z.number().min(1),
});

interface TestFormProps {
  onFormSubmit: () => void;
}

export default function TestForm({ onFormSubmit }: TestFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfQuestions: 10,
      timer: 10,
    },
  });

  const { control, watch, setValue } = form;

  const selectedSubject = watch("subject");
  const selectedTopic = watch("topic");

  // Compute filtered topics and max questions dynamically
  const { filteredTopics, maxQuestions } = useMemo(() => {
    let topics = [];
    let maxQuestions = 0;

    if (selectedSubject === "All") {
      topics = Array.from(questionTopics);
      maxQuestions = questionData.reduce(
        (total, item) => total + item.questions.length,
        0
      );
    } else {
      const subjectData = questionData.filter(
        (item) => item.subject === selectedSubject
      );
      topics = subjectData.flatMap((item) => item.topic);
      maxQuestions = subjectData.reduce(
        (total, item) => total + item.questions.length,
        0
      );
    }

    if (selectedTopic && selectedTopic !== "All") {
      const topicQuestions = questionData.find(
        (item) => item.topic === selectedTopic
      )?.questions.length;
      maxQuestions = topicQuestions ?? maxQuestions;
    }

    return { filteredTopics: topics, maxQuestions };
  }, [selectedSubject, selectedTopic]);

  // 🔹 Instantly update `numberOfQuestions` & `timer` when `maxQuestions` changes
  useEffect(() => {
    if (maxQuestions > 0) {
      setValue("numberOfQuestions", Math.min(10, maxQuestions)); // Set default as min(10, max)
      setValue("timer", Math.min(10, maxQuestions)); // Set timer same as numberOfQuestions
    }
  }, [maxQuestions, setValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(
      `/test?subject=${values.subject}&topic=${values.topic}&numberOfQuestions=${values.numberOfQuestions}&timer=${values.timer}`
    );
    onFormSubmit();
  }

  return (
    <div className="flex justify-center items-center h-full p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Test</CardTitle>
          <CardDescription>Customize your test settings.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {availableSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedSubject && (
                <FormField
                  control={control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            {filteredTopics.map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedSubject && selectedTopic && (
                <>
                  <FormField
                    control={control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Number of Questions ({field.value} MCQs)
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={maxQuestions}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) =>
                              setValue("numberOfQuestions", value[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="timer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timer ({field.value} minutes)</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={maxQuestions}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) =>
                              setValue("timer", value[0])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedSubject || !selectedTopic}
              >
                Start Test
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
