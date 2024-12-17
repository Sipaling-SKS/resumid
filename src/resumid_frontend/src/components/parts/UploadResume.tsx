import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UploadResumeProps {
  onSubmit: (file: File) => void;
  isLoading?: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
}

function UploadResume({ onSubmit, isLoading, file, setFile }: UploadResumeProps) {
  const handleOnFileSelected = (value: File) => {
    setFile(value)
  }

  return (
    <Card className="space-y-5 md:space-y-6 p-6 md:p-8 max-w-md">
      <CardHeader>
        <CardTitle className="w-full text-center font-outfit font-semibold text-heading">
          Upload Resume
        </CardTitle>
        <CardDescription className="w-full text-center font-inter text-md text-paragraph">
          Upload your resume to get started with the analysis.
        </CardDescription>
      </CardHeader>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <CardContent>
        <div className="space-y-4">
          <FileInput onFileSelected={handleOnFileSelected} file={file} setFile={setFile} />
          <p className="w-full text-center font-inter text-paragraph">Readable Files: PDF Only</p>
        </div>
      </CardContent>
      <Button
        onClick={() => {
          if (file) {
            onSubmit(file);
          } else {
            toast({ description: "Please select a file to proceed.", variant: "destructive" });
          }
        }}
        disabled={!file || isLoading}
        className="w-full"
      >
        {isLoading && <Loader2 className="animate-spin" />}
        Next
      </Button>
    </Card>
  )
}

export default UploadResume;