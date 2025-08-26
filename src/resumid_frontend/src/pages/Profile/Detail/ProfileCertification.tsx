import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeInfo, ExternalLink, Pencil, Plus } from "lucide-react";
import { ProfileType } from "@/types/profile-types";
import ProfileCertificationSkeleton from "./Skeleton/ProfileCertificationSkeleton";

interface ProfileCertificationType {
  isOwner?: boolean
  loading?: boolean
  detail: ProfileType
  onAdd?: () => void
  onEdit?: (id: string) => void
}

export default function ProfileCertification({ isOwner = false, detail, loading = false, onEdit, onAdd }: ProfileCertificationType) {
  const certifications = detail?.certifications ?? []
  const maxCertification = 3;

  if (loading) return (
    <ProfileCertificationSkeleton isOwner={isOwner} />
  )

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center p-4 sm:px-6 sm:py-5 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">
          Certification
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
            Highlight your professional certifications, licenses, and credentials to showcase your verified expertise and career achievements.
          </div>
        )}

        {/* Certification List */}
        <div className="flex flex-col gap-4 font-inter">
          {/* Certification Item */}
          {certifications?.slice(0, maxCertification)?.map((certification) => (
            <Card className="border rounded-lg p-0 shadow-sm">
              <div className="relative flex justify-between">
                <div className="w-full p-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{certification.title}</h4>
                    {certification?.credential_url && (
                      <a href={certification.credential_url} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h6 className="text-sm italic font-light text-muted-foreground">
                    {certification.issuer}
                  </h6>
                </div>

                {/* Right Button Column */}
                {isOwner && (
                    <div className="absolute top-4 right-4 sm:top-0 sm:right-0 sm:relative sm:flex flex-col items-center justify-center sm:p-2 sm:border-l border-neutral-200 self-stretch">
                      <Button
                        onClick={() => onEdit?.(certification.id)}
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
        {(certifications?.length ?? 0) > maxCertification && (
          <Button variant="default" className="w-full">
            Show All Certification
            <ArrowRight />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
