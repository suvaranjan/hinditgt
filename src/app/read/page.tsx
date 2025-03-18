import MCQReader from "@/components/mcq-reader";
import syllabusData from "@/data/syllabus.json";
import questionData from "@/data/mcqs/question.json";

type SearchParams = {
  "read-style"?: string;
  "read-subject"?: string;
  "read-topic"?: string;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const readStyle = searchParams["read-style"] || "MCQs";
  const readSubject = searchParams["read-subject"] || "All";
  const readTopic = searchParams["read-topic"] || "All";

  // Filter questions based on subject and topic
  const filteredQuestions = questionData
    .filter(
      (item) =>
        (readSubject === "All" || item.subject === readSubject) &&
        (readTopic === "All" || item.topic === readTopic)
    )
    .flatMap((item) => item.questions); // Extracting all matching questions

  // Find the topic details from syllabus data
  const topicDetails =
    readTopic !== "All"
      ? syllabusData.find((item) => item.topic === readTopic)
      : null;

  const title = topicDetails
    ? `Sub : ${topicDetails.topic} (${topicDetails.writer})`
    : readSubject !== "All"
    ? `${readSubject}`
    : "Reading Material";

  return (
    <div className="min-h-screen bg-background">
      {readStyle === "MCQs" && filteredQuestions.length > 0 && (
        <MCQReader questions={filteredQuestions} title={title} />
      )}
      {filteredQuestions.length === 0 && readStyle === "MCQs" && (
        <p className="mt-4 text-muted-foreground text-center">
          No MCQs available for this selection.
        </p>
      )}
    </div>
  );
}
