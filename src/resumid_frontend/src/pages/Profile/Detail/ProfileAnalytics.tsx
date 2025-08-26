import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { ProfileAnalyticsSkeleton } from "./Skeleton/ProfileAnalyticsSkeleton";

interface ProfileAnalyticsProps {
  detail: any
  loading?: boolean
  endorsementInfo?: any[]
  isOwner?: boolean
}

export default function ProfileAnalytics({ detail, loading = false, endorsementInfo = [], isOwner = false }: ProfileAnalyticsProps) {
  const maxViewLength = 3;
  const basePinataUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;

  const navigate = useNavigate();

  if (loading) return (
    <ProfileAnalyticsSkeleton />
  )

  if (!isOwner) {
    return null;
  }

  return (
    <Card className="p-0 overflow-hidden space-y-0">
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-4 py-4 w-full border-b border-neutral-200">
        <h3 className="font-outfit text-lg text-heading font-semibold">Latest Endorsement</h3>
      </CardTitle>
      <CardContent className="relative flex flex-wrap gap-4 p-4">
        {endorsementInfo?.length > 0 ? (
          endorsementInfo.slice(0, maxViewLength).map((endorse, index) => {
            const endorsedAvatarCid = endorse?.avatar || null;
            const endorsedAvatarUrl = endorsedAvatarCid ? `${basePinataUrl}/ipfs/${endorsedAvatarCid}` : null;
            
            return (
              <Card key={endorse.profileId || index} className="p-4 flex flex-row items-center gap-3 w-full space-y-0">
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={endorsedAvatarUrl || `https://ui-avatars.com/api/?name=${endorse?.name || "Resumid User"}&background=225adf&color=f4f4f4`} 
                    alt={`profile-avatar-${endorse.name}`} 
                  />
                  <AvatarFallback>{endorse?.name?.charAt(0)?.toUpperCase() || "R"}</AvatarFallback>
                </Avatar>
                <div className="font-inter">
                  <p className="text-sm text-paragraph font-semibold">
                    {endorse.name}
                  </p>
                  <button 
                    onClick={() => navigate(`/profile/${endorse.profileId}`)} 
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Visit Profile
                  </button>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="p-4 outline-dashed outline-2 outline-neutral-300 outline-offset-1 rounded-lg bg-neutral-50">
            <p className="text-paragraph font-inter text-xs text-center text-balance">You haven't been endorsed by anyone, go endorse other people to get noticed!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
