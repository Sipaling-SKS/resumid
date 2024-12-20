import PreviewResume, { PreviewFormValues } from "@/components/parts/PreviewResume";
import UploadResume from "@/components/parts/UploadResume";
import { toast } from "@/hooks/use-toast";
import { cleanExtractedText, extractPDFContent } from "@/lib/pdf2text";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { SubmitHandler } from "react-hook-form";
import { resumid_backend } from "../../../../declarations/resumid_backend"
import { AnalyzeStructure, History } from "../../../../declarations/resumid_backend/resumid_backend.did"

export type Resume = {
  fullText: string
  filename: string
  jobTitle: string
  jobDescription?: string
}

function Analyzer() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)

  const [resume, setResume] = useState<Resume>({
    fullText: "",
    filename: "",
    jobTitle: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    if (resume.fullText !== "" && resume.filename === file?.name) {
      setStep(1);
      return;
    }

    setLoading(true)

    try {
      const text = await extractPDFContent(file);

      if (!text) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Failed to extract your resume.",
          variant: "destructive",
        })
        return;
      }

      const cleanedText = cleanExtractedText(text);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResume({
        fullText: text,
        filename: file.name,
        jobTitle: "",
      });
      setStep(1);
    } catch (error) {
      console.error(error)
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  const analyzeResume: SubmitHandler<PreviewFormValues> = async (data) => {
    setLoading(true)
    try {
      const finalData: Resume = { ...resume, ...data };
  
      const { fullText, filename, jobTitle, jobDescription } = finalData
  
      const res: [] | [AnalyzeStructure] = await resumid_backend.AnalyzeResume(fullText, jobTitle, jobDescription || "")
      
      console.log(res)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const MultiStepPage = () => {
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
          <PreviewResume
            isLoading={isLoading}
            onSubmit={analyzeResume}
            resume={resume}
            setResume={setResume}
            setStep={setStep}
          />
        );
      default:
        return <h1>Default</h1>;
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Upload to start analyzing - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-8">
        <div className="flex justify-center">
          <MultiStepPage />
        </div>
      </main>
    </>
  )
}

export default Analyzer;