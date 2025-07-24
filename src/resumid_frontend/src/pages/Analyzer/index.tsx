import { Document, Page, pdfjs } from 'react-pdf';
import UploadResume from "@/components/parts/UploadResume";
import { toast } from "@/hooks/use-toast";
import { cleanExtractedText, extractPDFContent } from "@/lib/pdf2text";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/AuthContext";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export type Resume = {
  fullText: string;
  filename: string;
  jobTitle: string;
  fileUrl?: string;
};

export interface PreviewFormValues {
  jobTitle: string;
  accept: boolean;
}

function Analyzer() {
  const [isLoading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<Resume>({
    fullText: "",
    filename: "",
    jobTitle: "",
    fileUrl: undefined,
  });
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const hasFirstLoaded = useRef(false); 

  const { resumidActor } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PreviewFormValues>({
    defaultValues: { jobTitle: "", accept: false }
  });

  useEffect(() => {
    if (step === 0) {
      reset();
      setResume({ fullText: "", filename: "", jobTitle: "", fileUrl: undefined });
      setFile(null);
      setNumPages(null);
      setPageNumber(1);
    }
  }, [step, reset]);

  const processFile = useCallback(async (selectedFile: File) => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    if (resume.fullText && resume.filename === selectedFile.name && resume.fileUrl) {
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const text = await extractPDFContent(selectedFile);
      const cleanedText = cleanExtractedText(text);
      if (!cleanedText) {
        toast({
          title: "Uh oh! Resume extraction went wrong.",
          description: "Could not extract text. Try another file.",
          variant: "destructive"
        });
        return;
      }
      setResume({
        fullText: cleanedText,
        filename: selectedFile.name,
        jobTitle: "",
        fileUrl: URL.createObjectURL(selectedFile),
      });
      setFile(selectedFile);
      setStep(1);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "There was a problem processing your file.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [resume]);

  const analyzeResume: SubmitHandler<PreviewFormValues> = useCallback(async (data) => {
    setLoading(true);
    if (!resume.fullText || !file) {
      toast({
        title: "Error",
        description: "Resume data is missing. Please re-upload.",
        variant: "destructive",
      });
      setLoading(false);
      setStep(0);
      return;
    }

    try {
      const finalResume: Resume = { ...resume, jobTitle: data.jobTitle };
      const cleanedFullText = finalResume.fullText.replaceAll("\"", "<ACK0007>");

      if (resumidActor) {
        const res = await resumidActor.AnalyzeResume(
          finalResume.filename,
          cleanedFullText,
          finalResume.jobTitle,
          ""
        );
        if (!(res && res.length > 0)) {
          toast({
            title: "Analyzing failed",
            description: "There was a problem analyzing your resume.",
            variant: "destructive",
          });
          return;
        }
        toast({ title: "Success", description: "Resume submitted!" });
        navigate("/history", { replace: true });
      } else {
        toast({
          title: "Authentication Error",
          description: "Not authenticated. Please log in again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Error submitting resume for analysis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [resume, file, resumidActor, navigate]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    if (hasFirstLoaded.current) return; // Prevents re-setting on subsequent loads
    hasFirstLoaded.current = true; // Set flag to true after first load
    setNumPages(numPages);
    setPageNumber(pageNumber);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("PDF load error:", err);
    toast({
      title: "PDF Load Error",
      description: "Could not load PDF preview.",
      variant: "destructive",
    });
  }, []);

  const MultiStepPage = useCallback(() => {
    const pageWidth = useMemo(() => {
      if (typeof window !== "undefined") {
        return window.innerWidth > 768 ? 700 : Math.floor(window.innerWidth * 0.8);
      }
      return 700;
    }, [typeof window !== "undefined" ? window.innerWidth : 0]);

    switch (step) {
      case 0:
        return (
          <UploadResume
            isLoading={isLoading}
            onSubmit={processFile}
            file={file}
            setFile={setFile}
          />
        );
      case 1:
        return (
          <form onSubmit={handleSubmit(analyzeResume)} className="w-full max-w-4xl space-y-6 p-4 md:p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Review Resume and Add Job Title</h1>
            <div className="flex items-center justify-center p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
              <span>{resume.filename}</span>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-inner bg-gray-100 flex justify-center items-center relative" style={{ minHeight: '400px' }}>
              {resume.fileUrl ? (
                <>
                  {numPages && numPages > 1 && (
                    <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white flex justify-center p-2 space-x-4 z-10">
                      <button type="button" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}
                        className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        Previous
                      </button>
                      <span className="font-medium text-lg">Page {pageNumber} of {numPages}</span>
                      <button type="button" onClick={() => setPageNumber(p =>  p + 1)} disabled={pageNumber >= numPages!}
                        className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        Next
                      </button>
                    </div>
                  )}
                  <Document
                    file={resume.fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    className="w-full flex justify-center items-center py-4"
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer
                      renderAnnotationLayer
                      width={pageWidth}
                      className="shadow-lg"
                    />
                  </Document>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">Please upload a PDF file to see the preview.</div>
              )}
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                id="jobTitle"
                {...register('jobTitle', { required: "Job title is required." })}
                placeholder="Ex: Software Engineer"
                className={`w-full p-3 border rounded-md ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.jobTitle && <p className="text-red-500 text-xs">{errors.jobTitle.message}</p>}
            </div>
            <div className="flex items-center">
              <input id="accept" type="checkbox" {...register('accept', { required: "You must accept terms." })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="accept" className="ml-2 text-sm text-gray-900">I accept the terms and conditions *</label>
            </div>
            {errors.accept && <p className="text-red-500 text-xs">{errors.accept.message}</p>}
            <div className="flex justify-between pt-4">
              <button type="button" onClick={() => {
                setStep(0);
                if (resume.fileUrl) URL.revokeObjectURL(resume.fileUrl);
              }} disabled={isLoading} className="px-6 py-2 bg-gray-200 rounded-md">
                Previous
              </button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md">
                {isLoading ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          </form>
        );
      default:
        return (
          <div className="text-center text-red-500">
            <h1 className="text-3xl font-bold">Unknown Step</h1>
            <button onClick={() => setStep(0)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go to Upload</button>
          </div>
        );
    }
  }, [step, isLoading, processFile, file, resume, handleSubmit, analyzeResume, numPages, pageNumber, onDocumentLoadSuccess, onDocumentLoadError, register, errors]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Upload to start analyzing - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-8">
        <div className="flex justify-center items-start min-h-[calc(100vh-80px)]">
          <MultiStepPage />
        </div>
      </main>
    </>
  );
}

export default Analyzer;
