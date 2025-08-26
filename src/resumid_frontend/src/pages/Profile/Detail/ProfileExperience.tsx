import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeInfo, Pencil, Plus } from "lucide-react";
import { ProfileType } from "@/types/profile-types";
import { cn, formatDate, getPeriodLength } from "@/lib/utils";
import ProfileExperienceSkeleton from "./Skeleton/ProfileExperienceSkeleton";
import { useState } from "react";
import ExpandableHtml from "@/components/parts/ExpandableHtml";

interface ProfileExperienceProps {
  isOwner?: boolean
  loading?: boolean
  detail: ProfileType
  onAdd?: () => void
  onEdit?: (id: string) => void
}

export default function ProfileExperience({ isOwner = false, detail, loading = false, onAdd, onEdit }: ProfileExperienceProps) {
  const workExperiences = detail?.resume?.workExperiences ?? [];
  const maxWorkExperience = 3;

  if (loading) return (
    <ProfileExperienceSkeleton isOwner={isOwner} />
  )

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center p-4 sm:px-6 sm:py-5 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">
          Work Experience
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
            Highlight your professional roles, responsibilities, and key achievements to showcase your career journey and expertise.
          </div>
        )}

        {/* Experience List */}
        <div className="flex flex-col gap-4 font-inter">
          {workExperiences?.slice(0, maxWorkExperience)?.map((workExperience, idx) => {
            const [expanded, setExpanded] = useState(false);

            return (
              <Card key={idx} className="border rounded-lg p-0 shadow-sm">
                <div className="relative flex justify-between">
                  <div className="w-full p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-1 mb-1">
                      <h4 className="w-4/5 sm:w-auto font-semibold leading-normal">
                        {workExperience.position}
                      </h4>
                      <span className="text-xs text-blue-600 font-semibold flex flex-wrap gap-1 items-center">
                        {`${formatDate(workExperience.period.start)} - ${formatDate(workExperience.period?.end) ?? "Present"}`}
                        {workExperience.period?.start && (
                          <>
                            <span className="text-[6px]">✦</span>
                            {getPeriodLength(workExperience.period.start, workExperience.period?.end)}
                          </>
                        )}
                      </span>
                    </div>
                    <h6 className="text-sm italic font-light text-muted-foreground leading-normal">
                      {workExperience.company}
                      {workExperience?.employment_type && ` - ${workExperience.employment_type}`}
                    </h6>

                    {workExperience?.description && (
                      <ExpandableHtml html={workExperience.description} clamp={5} />
                    )}
                  </div>

                  {isOwner && (
                    <div className="absolute top-4 right-4 sm:top-0 sm:right-0 sm:relative sm:flex flex-col items-center justify-center sm:p-2 sm:border-l border-neutral-200 self-stretch">
                      <Button
                        onClick={() => onEdit?.(workExperience.id)}
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
            );
          })}

        </div>

        {/* Show All Button */}
        {(workExperiences?.length ?? 0) > maxWorkExperience && (
          <Button variant="default" className="w-full">
            Show All Working Experience
            <ArrowRight />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
