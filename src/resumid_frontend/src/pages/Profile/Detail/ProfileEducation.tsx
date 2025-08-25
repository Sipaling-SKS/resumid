import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeInfo, Pencil, Plus } from "lucide-react";
import { ProfileType } from "@/types/profile-types";
import { formatDate } from "@/lib/utils";
import ProfileEducationSkeleton from "./Skeleton/ProfileEducationSkeleton";
import ExpandableHtml from "@/components/parts/ExpandableHtml";

interface ProfileEducationType {
  isOwner?: boolean
  loading?: boolean
  detail: ProfileType
  onAdd?: () => void
  onEdit?: (id: string) => void
}

export default function ProfileEducation({ isOwner = false, detail, loading = false, onEdit, onAdd }: ProfileEducationType) {
  const educations = detail?.resume?.educations ?? [];
  const maxEducation = 3;

  if (loading) return (
    <ProfileEducationSkeleton isOwner={isOwner} />
  )

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center p-4 sm:px-6 sm:py-5 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">
          Education
        </h3>
        {isOwner && (
          <Button
            onClick={onAdd}
            variant="grey-outline"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 h-8 w-8"
          >
            <Plus />
          </Button>
        )}
      </CardTitle>

      <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
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
              <div className="relative flex justify-between">
                <div className="w-full p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-1 mb-1">
                    <h4 className="w-4/5 sm:w-auto font-semibold leading-normal">
                      {education.institution}
                    </h4>
                    <span className="text-xs text-blue-600 font-semibold flex flex-wrap gap-1 items-center">
                      {`${formatDate(education.period.start)} - ${formatDate(education.period?.end) ?? "Present"}`}
                    </span>
                  </div>
                  <h6 className="text-sm italic font-light text-muted-foreground leading-normal">
                    {education.degree}
                  </h6>
                  {education?.description && (
                    <ExpandableHtml html={education.description} clamp={4} />
                  )}
                </div>

                {/* Right Button Column */}
                {isOwner && (
                  <div className="absolute top-4 right-4 sm:top-0 sm:right-0 sm:relative sm:flex flex-col items-center justify-center sm:p-2 sm:border-l border-neutral-200 self-stretch">
                      <Button
                        onClick={() => onEdit?.(education.id)}
                        variant="grey-outline"
                        size="icon"
                        className="h-8 w-8 bg-white"
                      >
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
