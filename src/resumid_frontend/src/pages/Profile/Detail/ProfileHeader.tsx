import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, Pencil, PlusIcon, UserCheck, Eye, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarDialog } from "./Dialog/AvatarDialog";
import { useEffect, useState } from "react";
import { BannerDialog } from "./Dialog/BannerDialog";
import { DetailDialog } from "./Dialog/DetailDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProfileType } from "@/types/profile-types";
import { ProfileHeaderSkeleton } from "./Skeleton/ProfileHeaderSkeleton";

import BannerPlaceholder from "@/assets/banner_placeholder.jpg"
import { useImageLoader } from "@/hooks/useImageLoader";
import { Skeleton } from "@/components/ui/skeleton";

type OpenTypes = {
  avatar: boolean;
  banner: boolean;
  detail: boolean;
};

interface ProfileHeaderProps {
  queryKey: (string | number)[],
  detail: ProfileType,
  loading?: boolean,
  isOwner?: boolean,
  isNewUser?: boolean,
  isEndorsed?: boolean,
  endorsmentInfo: any[],
  onEndorseProfile?: () => void,
  onSectionAdd?: (key: any) => void
}

export default function ProfileHeader({
  queryKey,
  detail,
  loading = false,
  isOwner = false,
  isNewUser = false,
  isEndorsed = false,
  endorsmentInfo = [],
  onSectionAdd,
  onEndorseProfile
}: ProfileHeaderProps
) {
  const basePinataUrl = import.meta.env.VITE_PINATA_GATEWAY_URL

  const avatarCid = detail?.profileDetail?.profileCid || null;
  const avatarUrl = avatarCid ? `${basePinataUrl}/ipfs/${avatarCid}` : null;
  const avatar = useImageLoader();

  const bannerCid = detail?.profileDetail?.bannerCid || null;
  const bannerUrl = bannerCid ? `${basePinataUrl}/ipfs/${bannerCid}` : null;
  const banner = useImageLoader();

  const [open, setOpen] = useState<OpenTypes>({
    avatar: false,
    banner: false,
    detail: false
  })

  const handleOpenDialog = (key: keyof OpenTypes) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isEmptySection = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  const availableSections = [
    { key: "summary", label: "About" },
    { key: "workExperiences", label: "Work Experiences" },
    { key: "educations", label: "Educations" },
    { key: "skills", label: "Skills" },
    { key: "certifications", label: "Certifications" }
  ];

  const sectionValues = { ...detail?.resume, certifications: detail?.certifications } as Record<string, unknown>;

  const addedSections = availableSections.filter(
    (section) => !isEmptySection(sectionValues?.[section.key])
  );

  const notAddedSections = availableSections.filter(
    (section) => isEmptySection(sectionValues?.[section.key])
  );

  useEffect(() => {
    if (isNewUser && isOwner) {
      handleOpenDialog("detail");
    }
  }, [isNewUser, isOwner])

  return (
    <>
      {!loading ? (
        <Card className="p-0 overflow-hidden space-y-0 rounded-none border-none">
          {/* Top banner */}
          <div onClick={() => handleOpenDialog("banner")} className="relative w-full h-36 sm:h-56 bg-white cursor-pointer">
            {!banner.loaded ? (
              <Skeleton className="absolute inset-0" />) : (
              <div className="opacity-0 hover:opacity-100 transition-opacity absolute w-full h-full flex justify-center items-center bg-black/20">
                <div className="flex justify-center items-center bg-black/50 text-white p-4 sm:p-6 rounded-full backdrop-blur-[2px]">
                  <Eye className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </div>
            )}

            <img
              src={bannerUrl || BannerPlaceholder}
              alt="profile-banner"
              className={cn(
                "w-full h-full object-cover object-center transition-opacity duration-500",
                banner.loaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={banner.handleLoad}
            />
          </div>

          {/* Profile Section */}
          <div className="responsive-container">
            <CardContent className="relative py-6 sm:pt-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                {/* Avatar - left column */}
                <div className="flex-shrink-0 w-32 sm:min-w-[180px] sm:max-w-[280px] sm:w-full flex flex-col items-center">
                  <div
                    onClick={() => handleOpenDialog("avatar")}
                    className="relative w-full aspect-square rounded-full border-2 sm:border-4 border-white bg-white -mt-24 sm:-mt-32 overflow-hidden cursor-pointer"
                  >
                    {/* Skeleton placeholder */}
                    {!avatar.loaded && (
                      <Skeleton className="absolute inset-0" />
                    )}

                    {/* Avatar image */}
                    <img
                      src={
                        avatarUrl ||
                        `https://ui-avatars.com/api/?name=${detail?.profileDetail?.name || "Resumid User"}&background=225adf&color=f4f4f4`
                      }
                      alt="profile-avatar"
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-500",
                        avatar.loaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={avatar.handleLoad}
                    />

                    {/* Hover overlay */}
                    {avatar.loaded && (
                      <div className="opacity-0 hover:opacity-100 transition-opacity absolute inset-0 flex justify-center items-center bg-black/20">
                        <div className="bg-black/50 text-white p-6 rounded-full backdrop-blur-[2px]">
                          <Eye />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info - right column */}
                <div className="flex-1 flex flex-col gap-2">
                  {isOwner && (
                    <Button
                      variant="grey-outline"
                      size="icon"
                      className="absolute top-6 right-0 h-8 w-8"
                      onClick={() => handleOpenDialog("detail")}
                    >
                      <Pencil />
                    </Button>
                  )}
                  <div className="flex gap-2 justify-between items-start">
                    {/* Name Info */}
                    <div className="flex flex-col flex-1 gap-2">
                      <h2 className="text-xl font-outfit font-semibold text-heading">
                        {detail?.profileDetail?.name}
                      </h2>
                      {/* Role Badge */}
                      {detail?.profileDetail?.current_position && (
                        <div>
                          <span
                            className="inline-flex items-center px-3 py-1 gap-1 rounded-full text-sm font-inter font-semibold text-primary-500 border-2 border-primary-500"
                          >
                            <Briefcase className="w-[18px] h-[18px] text-primary-500" />
                            {detail?.profileDetail.current_position}
                          </span>
                        </div>
                      )}
                      {detail?.profileDetail?.description && (
                        <p className="font-inter text-paragraph">
                          {detail?.profileDetail.description}
                        </p>
                      )}
                    </div>
                    {/* Analytics */}
                    {!isOwner && (endorsmentInfo?.length ?? 0) > 0 && (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex mb-1 -mr-1">
                          {/* TODO: Endorsment avatar */}
                          {endorsmentInfo.slice(0, 3).map((item, index) => {
                            const endorsedAvatarCid = item?.profileCid || null;
                            const endorsedAvatarUrl = endorsedAvatarCid ? `${basePinataUrl}/ipfs/${endorsedAvatarCid}` : null;
                            
                            return (
                              <Avatar className={cn("w-8 h-8 border-[2px] border-white", index > 0 ? "-ml-3" : "")}>
                                <AvatarImage
                                  src={endorsedAvatarUrl || `https://ui-avatars.com/api/?name=${item?.name || "Resumid User"}&background=225adf&color=f4f4f4`}
                                />
                              </Avatar>
                            )
                          })}
                        </div>
                        <div className="font-inter text-xs text-primary-500 text-right">
                          <span className="font-semibold">{endorsmentInfo.length} Peoples</span><br />
                          Endorsed this profile
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Action Buttons */}
                  {isOwner ? (
                    <div className="flex gap-4 mt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="default" size="sm">
                            <PlusIcon />
                            Add Profile Section
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            Sections
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {notAddedSections.length > 0 ? (
                            notAddedSections.map(section => (
                              <DropdownMenuItem
                                key={section.key}
                                className="cursor-pointer"
                                onClick={() => {
                                  setTimeout(() => onSectionAdd && onSectionAdd?.(section.key), 0);
                                }}
                              >
                                <PlusIcon />
                                {section.label}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              You've added all available section
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button className="text-blue-600 font-inter text-sm font-medium hover:underline">
                        Profile Builder
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 mt-2">
                      <Button variant="default" size="sm" onClick={onEndorseProfile}>
                        {isEndorsed ? <UserMinus /> : <UserCheck />}
                        {isEndorsed ? "Unendorse Profile" : "Endors Profile"}
                      </Button>
                      <button className="text-blue-600 font-inter text-sm font-medium hover:underline">
                        Contact Info
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ) : (
        <ProfileHeaderSkeleton />
      )}

      {!loading && (
        <>
          <BannerDialog queryKey={queryKey} url={bannerUrl} isOwner={isOwner} open={open.banner} setOpen={() => handleOpenDialog("banner")} />
          <AvatarDialog queryKey={queryKey} url={avatarUrl} name={detail?.profileDetail?.name} isOwner={isOwner} open={open.avatar} setOpen={() => handleOpenDialog("avatar")} />
          <DetailDialog queryKey={queryKey} detail={detail} open={open.detail} setOpen={() => handleOpenDialog("detail")} />
        </>
      )}
    </>
  );
}
