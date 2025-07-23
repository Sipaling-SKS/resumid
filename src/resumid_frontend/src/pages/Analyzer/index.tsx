import PreviewResume, { PreviewFormValues } from "@/components/parts/PreviewResume";
import UploadResume from "@/components/parts/UploadResume";
import { toast } from "@/hooks/useToast";
import { cleanExtractedText, extractPDFContent } from "@/lib/pdf2text";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { SubmitHandler } from "react-hook-form";
import { resumid_backend } from "../../../../declarations/resumid_backend"
// import { AnalyzeStructure, History } from "../../../../declarations/resumid_backend/resumid_backend.did"
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

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

  const { resumidActor } = useAuth();
  const navigate = useNavigate()

  const processFile = async (file: File) => {
    if (resume.fullText !== "" && resume.filename === file?.name) {
      setStep(1);
      return;
    }

    setLoading(true)

    try {
      const text = await extractPDFContent(file);

      const cleanedText = cleanExtractedText(text);

      if (!cleanedText) {
        toast({
          title: "Uh oh! Resume extraction went wrong.",
          description: "There was a problem when trying to extract your resume.",
          variant: "destructive",
        })
        return;
      }
      
      setResume({
        fullText: cleanedText,
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
      
      const cleanedJobDescription = jobDescription ? jobDescription.replaceAll("\n", " ") : undefined
      const cleanedFullText = fullText.replaceAll("\"", "<ACK0007>")

      const res: [] = await resumidActor.AnalyzeResume(filename, cleanedFullText, jobTitle, cleanedJobDescription || "")
      
      if (!(res && res.length > 0)) {
        toast({
          title: "Uh oh! Analzying went wrong.",
          description: "There was a problem when analyzing your resume.",
          variant: "destructive",
        })
      } else {
        navigate("/result", { replace: true });
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      })
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