"use client";

import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ReadForm from "@/components/read-form";
import TestForm from "@/components/test-form";
import { SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Home() {
  const [isReadSheetOpen, setIsReadSheetOpen] = useState(false);
  const [isTestSheetOpen, setIsTestSheetOpen] = useState(false);

  return (
    <div className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold mb-4 text-center">
          HindiTGT Preparation
        </h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by reading{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              MCQs
            </code>
            .
          </li>
          <li className="mb-2 tracking-[-.01em]">Read Books and Summary</li>
          <li className="tracking-[-.01em]">Take Mock Tests</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Read Now Sheet */}
          <Sheet open={isReadSheetOpen} onOpenChange={setIsReadSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="rounded-full p-5"
                // className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                {/* <Image
                  aria-hidden
                  src="/file.svg"
                  alt="File icon"
                  width={16}
                  height={16}
                /> */}
                Read now
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-[80vh] overflow-y-auto">
              <VisuallyHidden asChild>
                <SheetTitle>Read Form</SheetTitle>
              </VisuallyHidden>
              <ReadForm onFormSubmit={() => setIsReadSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Take Test Sheet */}
          <Sheet open={isTestSheetOpen} onOpenChange={setIsTestSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="rounded-full p-5"
                // className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                variant="outline"
              >
                Take Test
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-[80vh] overflow-y-auto">
              <VisuallyHidden asChild>
                <SheetTitle>Test Form</SheetTitle>
              </VisuallyHidden>
              <TestForm onFormSubmit={() => setIsTestSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </main>
    </div>
  );
}
