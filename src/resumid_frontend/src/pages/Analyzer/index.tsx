import UploadResume from "@/components/parts/UploadResume";
import { useState } from "react";
import { Helmet } from "react-helmet";

function Analyzer() {
  const [step, setStep] = useState<number>(0)

  const [resume, setResume] = useState<object | null>(null)

  const processFile = (file: File) => {

  }

  const MultiStepPage = () => {
    switch (step) {
      case 0:
        return <UploadResume onSubmit={processFile} />;
      default:
        return <UploadResume onSubmit={processFile} />;
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Upload to start analyzing - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-16">
        <div className="mx-auto">
          <MultiStepPage />
        </div>
      </main>
    </>
  )
}

export default Analyzer;