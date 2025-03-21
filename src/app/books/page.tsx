"use client";

import PDFViewer from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import syllabusData from "@/data/syllabusv2.json"; // Updated import
import React, { useState } from "react";

function Page() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Flatten the syllabus data to get all topics with book links
  const booksWithLinks = syllabusData.syllabus.flatMap((subject) =>
    subject.topics
      .filter((topic) => topic.bookLink !== null) // Filter topics with book links
      .map((topic) => ({
        topic: topic.name,
        writer: topic.author,
        bookLink: topic.bookLink,
      }))
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-5 text-center">
        {selectedTopic ? selectedTopic : "Available Books"}
      </h1>
      {!selectedBook && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {booksWithLinks.map((book, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{book.topic}</h2>
              <p className="text-gray-600 dark:text-gray-500">
                By {book.writer}
              </p>
              <Button
                onClick={() => {
                  setSelectedBook(book.bookLink!);
                  setSelectedTopic(book.topic);
                }}
                className="mt-4"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div>
          <Button
            onClick={() => {
              setSelectedBook(null);
              setSelectedTopic(null);
            }}
            className="mb-3"
            variant="outline"
          >
            Back
          </Button>
          <PDFViewer gdriveUrl={selectedBook} />
        </div>
      )}
    </div>
  );
}

export default Page;
