import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";

const dummyEndorses = [
  {
    id: 1,
    username: "1_username",
    name: "1_name",
    avatarId: "1_avatar_id",
  },
  {
    id: 2,
    username: "2_username",
    name: "2_name",
    avatarId: "2_avatar_id",
  },
  {
    id: 3,
    username: "3_username",
    name: "3_name",
    avatarId: "3_avatar_id",
  },
  {
    id: 4,
    username: "4_username",
    name: "4_name",
    avatarId: "4_avatar_id",
  },
  {
    id: 5,
    username: "5_username",
    name: "5_name",
    avatarId: "5_avatar_id",
  },
  {
    id: 6,
    username: "6_username",
    name: "6_name",
    avatarId: "6_avatar_id",
  },
  {
    id: 7,
    username: "7_username",
    name: "7_name",
    avatarId: "7_avatar_id",
  }
]

interface ProfileAnalyticsProps {
  detail: any
}

export default function ProfileAnalytics({ detail }: ProfileAnalyticsProps) {
  const maxViewLength = 3;
  const analytics: any[] = detail?.analytics || [];

  const navigate = useNavigate();

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-4 py-4 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-base text-heading font-semibold">Latest Endorsement</h3>
      </CardTitle>
      <CardContent className="relative flex flex-wrap gap-4 p-4">
        {analytics?.length > 0 ? (
          analytics.slice(0, maxViewLength).map((endorse, index) => (
            <Card className="p-4 flex flex-row items-center gap-3 w-full space-y-0">
              <Avatar key={index} className="w-12 h-12">
                <AvatarImage src="https://github.com/shadcn.png" alt={`profile-avatar-${endorse.username}`} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="font-inter">
                <p className="text-sm text-paragraph font-semibold">
                  {endorse.name}
                </p>
                <button onClick={() => navigate(`/profile/${endorse.username}`)} className="text-blue-600 text-sm font-medium hover:underline">
                  Visit Profile
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-4 outline-dashed outline-2 outline-neutral-300 outline-offset-1 rounded-lg bg-neutral-50">
            <p className="text-paragraph font-inter text-xs text-center text-balance">You haven't been endorsed by anyone, go endorse other people to get noticed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
