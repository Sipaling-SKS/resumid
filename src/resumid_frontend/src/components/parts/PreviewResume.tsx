import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume } from "@/pages/Analyzer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";

export type PreviewFormValues = {
  fullText: string
  jobTitle: string
  jobDescription?: string
}

const resolver: Resolver<PreviewFormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!values.fullText) {
    errors.fullText = {
      type: "required",
      message: "You can't leave the resume blank.",
    };
  }

  if (!values.jobTitle) {
    errors.jobTitle = {
      type: "required",
      message: "You can't leave job title blank.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

interface PreviewResumeProps {
  onSubmit: SubmitHandler<PreviewFormValues>
  resume: Resume;
  setResume: (value: Resume) => void;
  setStep: (value: number) => void;
}

function PreviewResume({ onSubmit, resume, setResume, setStep }: PreviewResumeProps) {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm<PreviewFormValues>({ resolver });

  setValue("fullText", resume.fullText)

  return (
    <Card className="space-y-5 md:space-y-6 p-6 md:p-8">
      <CardHeader>
        <CardTitle className="w-full text-center font-outfit font-semibold text-heading">
          Add Optional Information
        </CardTitle>
        <CardDescription className="w-full text-center font-inter text-md text-paragraph">
          Before submitting, review your resume and add optional information for better results.
        </CardDescription>
      </CardHeader>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Label className="space-y-2">
            <div className="inline-flex gap-1 items-center text-paragraph ">
              <CircleAlert size={16} strokeWidth={2.5} /> Review Resume
            </div>
            <div className="p-1">
              <Textarea
                {...register("fullText", { required: true })}
                className="min-h-32 max-h-64 py-1 font-normal outline-dashed outline-2 outline-primary-500 outline-offset-1 scrollbar"
              />
            </div>
            {errors?.fullText && <p className="text-sm text-red-500">{errors.fullText.message}</p>}
          </Label>
          <Label htmlFor="job-title" className="space-y-2">
            <p className="text-paragraph">Job Title<span className="text-red-500">*</span></p>
            <Input
              {...register("jobTitle", { required: true })}
              id="job-title"
              className="font-normal"
              type="text"
              placeholder="Ex: Software Engineer, Management Trainee, etc.."
            />
            {errors?.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}          
          </Label>
          <Label htmlFor="job-description" className="space-y-2">
            <p className="text-paragraph">{"Job Description (Optional)"}</p>
            <Textarea {...register("jobDescription")}  id="job-description" className="min-h-48 max-h-96 font-normal" placeholder="Paste the job description here" />
          </Label>
          <div className="pt-2 flex flex-col md:flex-row-reverse gap-2 md:gap-4">
            <Button type="submit" className="w-full">Analyze Now</Button>
            <Button className="w-full" variant="secondary" onClick={() => setStep(0)}>Go Back</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PreviewResume;