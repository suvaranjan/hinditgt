"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import syllabusData from "@/data/syllabus.json";
import questionData from "@/data/mcqs/question.json";
import { useRouter } from "next/navigation";

// Extract subjects and topics from question.json
const questionSubjects = new Set(questionData.map((item) => item.subject));
const questionTopics = new Set(questionData.flatMap((item) => item.topic));

// Filter syllabusData to only include matching subjects and topics
const filteredSyllabus = syllabusData.filter(
  (item) => questionSubjects.has(item.subject) && questionTopics.has(item.topic)
);

const uniqueSubjects = Array.from(
  new Set(filteredSyllabus.map((item) => item.subject))
);

const formSchema = z.object({
  subject: z.string({ required_error: "Please select a subject" }),
  topic: z.string(),
  contentType: z.enum(["MCQs", "summary"], {
    required_error: "Please select a content type",
  }),
});

interface ReadFormProps {
  onFormSubmit: () => void;
}

export default function ReadForm({ onFormSubmit }: ReadFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { contentType: "MCQs" },
  });

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .trim();
  }

  const selectedSubject = form.watch("subject");
  const filteredTopics = filteredSyllabus.filter(
    (item) => item.subject === selectedSubject
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.contentType === "MCQs") {
      const queryString = new URLSearchParams({
        "read-style": values.contentType,
        "read-subject": values.subject,
        "read-topic": values.topic || "All",
      }).toString();

      router.push(`/read?${queryString}`);
      onFormSubmit();
    } else {
      const slugifiedTopic = slugify(values.topic);
      router.push(`/summary/${slugifiedTopic}`);
      onFormSubmit();
    }
  }

  return (
    <div className="flex justify-center items-center h-full p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Choose Reading Material</CardTitle>
          <CardDescription>
            Select what you want to read from the syllabus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                          {uniqueSubjects.map((subject) => (
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
                  control={form.control}
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
                            {filteredTopics.map((item) => (
                              <SelectItem key={item.topic} value={item.topic}>
                                {item.topic} ({item.writer})
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

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-3">Content Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="MCQs" />
                          </FormControl>
                          <FormLabel>MCQs</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="summary" />
                          </FormControl>
                          <FormLabel>Summary</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter>
                <Button type="submit" className="w-full">
                  Read
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
