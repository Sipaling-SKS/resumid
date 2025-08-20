import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeInfo, Pencil, Plus } from "lucide-react";
import { ProfileDetailType } from "@/types/profile-types";
import { formatDate } from "@/lib/utils";

interface ProfileEducationType {
  isOwner?: boolean
  detail: ProfileDetailType
  onAdd?: () => void
  onEdit?: (id: string) => void
}

export default function ProfileEducation({ isOwner = false, detail, onEdit, onAdd }: ProfileEducationType) {
  const { educations } = detail;
  const maxEducation = 3;

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-6 py-5 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">
          Education
        </h3>
        {isOwner && (
          <Button
            onClick={onAdd}
            variant="grey-outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-6 h-8 w-8"
          >
            <Plus />
          </Button>
        )}
      </CardTitle>

      <CardContent className="flex flex-col gap-4 p-6">
        {/* Highlight Banner */}
        {isOwner && (
          <div className="inline-flex items-center w-full gap-2 border border-accent-600 p-3 rounded-lg text-[#333] font-medium font-inter text-xs bg-accent-950">
            <BadgeInfo className="text-accent-600 flex-shrink-0" size={16} />
            Share details of your academic background, degrees, and notable accomplishments to reflect your educational foundation.          </div>
        )}

        {/* Education List */}
        <div className="flex flex-col gap-4 font-inter">
          {/* Education Item */}
          {educations?.slice(0, maxEducation)?.map((education) => (
            <Card className="border rounded-lg p-0 shadow-sm">
              <div className="flex justify-between">
                <div className="w-full p-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{education.institution}</h4>
                    <span className="text-xs text-blue-600 font-semibold flex flex-wrap gap-1 items-center">
                      {formatDate(education.period.start)} - {formatDate(education.period?.end)}
                    </span>
                  </div>
                  <h6 className="text-sm italic font-light text-muted-foreground">
                    {education.degree}
                  </h6>
                  {/* TODO: Change to html/markdown rendered text here */}
                  {education?.description && (
                    <div
                      className="
                        mt-[6px]
                        prose prose-sm max-w-none
                        [&_.prose]:max-w-none
                        &_.prose]:text-paragraph
                        [&_ul]:pl-0 [&_ul]:list-disc marker:text-paragraph
                        [&_ol]:pl-0 [&_ol]:list-decimal
                        [&_p]:text-paragraph
                        [&_p]:my-0
                      "
                      dangerouslySetInnerHTML={{ __html: education.description }}
                    />
                  )}
                </div>

                {/* Right Button Column */}
                {isOwner && (
                  <div className="flex flex-col items-center justify-center p-2 border-l border-neutral-200 self-stretch">
                    <Button onClick={() => onEdit?.(education.id)} variant="grey-outline" size="icon" className="h-8 w-8">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Show All Button */}
        {(educations?.length ?? 0) > maxEducation && (
          <Button variant="default" className="w-full">
            Show All Education
            <ArrowRight />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
