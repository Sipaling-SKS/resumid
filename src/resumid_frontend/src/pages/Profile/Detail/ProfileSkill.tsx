import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfileDetailType } from "@/types/profile-types";
import { ProfileSkillsSkeleton } from "./Skeleton/ProfileSkillSkeleton";

interface ProfileSkillProps {
  isOwner?: boolean
  loading?: boolean
  detail: ProfileDetailType
  onEdit: () => void
}

export default function ProfileSkills({ isOwner = false, detail, loading = false, onEdit }: ProfileSkillProps) {
  const [expand, setExpand] = useState(false);
  const { skills = [] } = detail; 
  const maxSkill = 12;

  if (loading) return (
    <ProfileSkillsSkeleton />
  )

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-4 py-4 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-base text-heading font-semibold">Skills</h3>
        {isOwner && (
          <Button
            variant="grey-outline"
            size="icon"
            className="absolute top-[1/2] right-4 h-8 w-8"
            onClick={onEdit}
          >
            <Pencil />
          </Button>
        )}
      </CardTitle>
      <CardContent className="relative flex flex-wrap gap-2 p-4 font-inter">
        {skills.slice(0, expand ? Infinity : maxSkill).map((skill, index) => (
          <span key={index} className="inline-flex items-center px-3 py-[6px] rounded-full text-xs font-semibold bg-primary-500 text-white">
            {skill}
          </span>
        ))}
        {skills.length > maxSkill && (
          <span
            className="inline-flex items-center px-3 py-[6px] rounded-full text-xs font-semibold bg-white text-primary-500 border-2 border-primary-500 cursor-pointer hover:bg-primary-500 hover:text-white transition-colors"
            onClick={() => setExpand((prev) => !prev)}
          >
            {expand
              ? `Show less (${skills.length - maxSkill} hidden)`
              : `Show more (+${skills.length - maxSkill} skills)`
            }
          </span>
        )}
      </CardContent>
    </Card>
  );
}
