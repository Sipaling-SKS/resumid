import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Pencil } from "lucide-react";
import { ProfileDetailType } from "@/types/profile-types";
import ProfileAboutSkeleton from "./Skeleton/ProfileAboutSkeleton";

interface ProfileAboutProps {
  isOwner?: boolean
  loading?: boolean
  detail: ProfileDetailType
  onEdit: () => void
}

export default function ProfileAbout({ isOwner = false, detail, loading = false, onEdit }: ProfileAboutProps) {
  const { about } = detail;
  
  if (loading) return (
    <ProfileAboutSkeleton isOwner={isOwner} />
  )

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-6 py-5 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">About</h3>
        {isOwner && (
          <Button
            variant="grey-outline"
            size="icon"
            className="absolute top-[1/2] right-6 h-8 w-8"
            onClick={onEdit}
          >
            <Pencil />
          </Button>
        )}
      </CardTitle>
      <CardContent className="relative flex flex-col gap-4 p-6">
        <p className="font-inter text-sm text-paragraph leading-normal">
          {about}
        </p>
        {isOwner && (
          <div className="inline-flex items-center w-full gap-2 border border-accent-600 p-3 rounded-lg text-[#333] font-medium font-inter text-xs bg-accent-950">
            <BadgeInfo className="text-accent-600 flex-shrink-0" size={16} />
            Share a brief overview of your professional journey, experience, and skills so people can get to know your strengths and capabilities at a glance.          </div>
        )}
      </CardContent>
    </Card>
  );
}
