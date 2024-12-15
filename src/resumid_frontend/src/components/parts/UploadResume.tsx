import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Button } from "@/components/ui/button";

interface UploadResumeProps {
  onSubmit: (file: File) => void
}

function UploadResume({ onSubmit }: UploadResumeProps) {
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
          <FileInput onFileSelected={onSubmit} />
          <p className="w-full text-center font-inter text-paragraph">Readable Files: PDF Only</p>
        </div>
      </CardContent>
      <div className="">
        <Button className="w-full">
          Next
        </Button>
      </div>
    </Card>
  )
}

export default UploadResume;