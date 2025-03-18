"use client";

import { useState, useEffect } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  gdriveUrl: string;
  height?: string | number;
  width?: string | number;
}

export default function PDFViewer({
  gdriveUrl,
  height = "800px",
  width = "100%",
}: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  // Create the default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
  });

  useEffect(() => {
    if (!gdriveUrl) {
      setError("No PDF URL provided");
      setLoading(false);
      return;
    }

    try {
      // Convert Google Drive URL to direct download link
      // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const fileIdMatch = gdriveUrl.match(/\/d\/(.+?)\//);

      if (!fileIdMatch || !fileIdMatch[1]) {
        setError("Invalid Google Drive URL format");
        setLoading(false);
        return;
      }

      const fileId = fileIdMatch[1];
      // Use the export=view parameter which works better for PDF viewing
      const directDownloadUrl = `https://drive.google.com/file/d/${fileId}/preview`;

      // For Google Drive PDFs, we'll use an iframe approach instead
      setUseIframe(true);
      setPdfUrl(directDownloadUrl);
      setLoading(false);
    } catch (e) {
      setError("Failed to process the Google Drive URL");
      setLoading(false);
      console.log(e);
    }
  }, [gdriveUrl]);

  if (loading) {
    return (
      <div
        style={{ width, height }}
        className="flex flex-col gap-4 p-4 border rounded-lg"
      >
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Failed to load PDF. Please check the URL and try again."}
        </AlertDescription>
      </Alert>
    );
  }

  if (useIframe && pdfUrl) {
    return (
      <div
        style={{ width, height }}
        className="border rounded-lg overflow-hidden"
      >
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          // frameBorder="0"
          allowFullScreen
          title="PDF Viewer"
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width, height }}
      className="border rounded-lg overflow-hidden"
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          // onError={(error:any) => {
          //   console.error("PDF viewer error:", error);
          //   setError(
          //     "Failed to load PDF: " + (error.message || "Unknown error")
          //   );
          // }}
        />
      </Worker>
    </div>
  );
}
