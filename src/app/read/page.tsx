import MCQReader from "@/components/mcq-reader";
import syllabusData from "@/data/syllabusv2.json"; // Updated import

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const readStyle = searchParams["read-style"] || "MCQs";
  const readSubject = searchParams["read-subject"] || "All";
  const readTopic = searchParams["read-topic"] || "All";

  // Filter questions based on subject and topic
  const filteredQuestions = syllabusData.syllabus
    .filter(
      (subject) => readSubject === "All" || subject.subject === readSubject // Filter by subject
    )
    .flatMap(
      (subject) =>
        subject.topics
          .filter(
            (topic) => readTopic === "All" || topic.name === readTopic // Filter by topic
          )
          .flatMap((topic) => topic.questions || []) // Extract questions
    );

  // Find the topic details from syllabus data
  const topicDetails =
    readTopic !== "All"
      ? syllabusData.syllabus
          .flatMap((subject) => subject.topics)
          .find((topic) => topic.name === readTopic)
      : null;

  const title = topicDetails
    ? `Sub : ${topicDetails.name} (${topicDetails.author})`
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
