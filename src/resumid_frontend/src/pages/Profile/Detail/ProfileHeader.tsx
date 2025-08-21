import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, Pencil, PlusIcon, UserCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarDialog } from "./Dialog/AvatarDialog";
import { useEffect, useState } from "react";
import { BannerDialog } from "./Dialog/BannerDialog";
import { DetailDialog } from "./Dialog/DetailDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProfileType } from "@/types/profile-types";
import { ProfileHeaderSkeleton } from "./Skeleton/ProfileHeaderSkeleton";

import BannerPlaceholder from "@/assets/banner_placeholder.jpg"

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
  onSectionAdd?: (key: any) => void
}

export default function ProfileHeader({ queryKey, detail, loading = false, isOwner = false, isNewUser = false, onSectionAdd }: ProfileHeaderProps) {
  const basePinataUrl = import.meta.env.VITE_PINATA_GATEWAY_URL

  const avatarCid = detail?.profileDetail?.profileCid || null;
  const avatarUrl = avatarCid ? `${basePinataUrl}/ipfs/${avatarCid}` : null;
  console.log(avatarUrl);

  const bannerCid = detail?.profileDetail?.bannerCid || null;
  const bannerUrl = bannerCid ? `${basePinataUrl}/ipfs/${bannerCid}` : null;
  console.log(bannerUrl);

  const [open, setOpen] = useState<OpenTypes>({
    avatar: false,
    banner: false,
    detail: false
  })

  const handleOpenDialog = (key: keyof OpenTypes) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const availableSections = [
    { key: "summary", label: "About" },
    { key: "workExperiences", label: "Work Experiences" },
    { key: "educations", label: "Educations" },
    { key: "skills", label: "Skills" },
    { key: "certifications", label: "Certifications" }
  ];

  console.log(detail);

  const addedSections = availableSections.filter(
    section => ({...detail?.resume, certifications: detail?.certifications } as Record<string, unknown>)?.[section.key]
  );
  const notAddedSections = availableSections.filter(
    section => !({...detail?.resume, certifications: detail?.certifications }  as Record<string, unknown>)?.[section.key]
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
          <div onClick={() => handleOpenDialog("banner")} className="relative w-full h-56 cursor-pointer">
            <div className="opacity-0 hover:opacity-100 transition-opacity absolute w-full h-full flex justify-center items-center bg-black/20">
              <div className="flex justify-center items-center bg-black/50 text-white p-6 rounded-full backdrop-blur-[2px]">
                <Eye />
              </div>
            </div>
            <img
              src={bannerUrl || BannerPlaceholder}
              alt="profile-banner"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Profile Section */}
          <div className="responsive-container">
            <CardContent className="relative pt-6 pb-8">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Avatar - left column */}
                <div className="flex-shrink-0 min-w-[180px] max-w-[280px] w-full flex flex-col items-center">
                  <Avatar
                    onClick={() => handleOpenDialog("avatar")}
                    className="w-full h-full border-2 sm:border-4 border-white -mt-16 sm:-mt-32 overflow-hidden"
                  >
                    {/* hover overlay */}
                    <div className="opacity-0 hover:opacity-100 transition-opacity absolute inset-0 flex justify-center items-center bg-black/20">
                      <div className="bg-black/50 text-white p-6 rounded-full backdrop-blur-[2px]">
                        <Eye />
                      </div>
                    </div>

                    <AvatarImage
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${detail?.profileDetail?.name || "Resumid User"}&background=225adf&color=f4f4f4`}
                      alt="profile-avatar"
                      className="w-full h-full object-cover max-w-none"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
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
                    {!isOwner && (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex mb-1 -mr-1">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <Avatar key={index} className={cn("w-8 h-8 border-[2px] border-white", index > 0 ? "-ml-3" : "")}>
                              <AvatarImage src="https://github.com/shadcn.png" alt="profile-avatar" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="font-inter text-xs text-primary-500 text-right">
                          <span className="font-semibold">32 People</span><br />
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
                      <Button variant="default" size="sm">
                        <UserCheck />
                        Endorse Profile
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
