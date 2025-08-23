import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { Helmet } from "react-helmet";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileSkills from "./ProfileSkill";
import ProfileAnalytics from "./ProfileAnalytics";
import { EducationType, ProfileType, WorkExperienceType } from "@/types/profile-types";
import { AboutDialog } from "./Dialog/AboutDialog";
import { SkillDialog } from "./Dialog/SkillDialog";
import { ExperienceDialog } from "./Dialog/ExperienceDialog";
import { EducationDialog } from "./Dialog/EducationDialog";
import ProfileCertification from "./ProfileCertification";
import { CertificationDialog } from "./Dialog/CertificationDialog";
import { fromNullable } from "@/lib/optionalField";
import { sortByPeriod } from "@/utils/sortByPeriod";

type OpenTypes = {
  sectionMenu: boolean
  summary: boolean
  workExperiences: boolean
  educations: boolean
  skills: boolean
  certifications: boolean
}

type SelectedTypes = {
  workExperiences: string | null
  educations: string | null
  certifications: string | null
}

type ProfileDetailResponse = {
  profile: ProfileType | null;
  endorsementInfo: any[];
};

export default function ProfileDetail() {
  const KEY = "profile"

  const { id } = useParams()
  const { resumidActor, userData } = useAuth();

  const location = useLocation();
  const { state } = location;
  const isNewUser = state?.isNewUser || false;

  const [open, setOpen] = useState<OpenTypes>({
    sectionMenu: false,
    summary: false,
    workExperiences: false,
    educations: false,
    skills: false,
    certifications: false
  })

  const handleOpen = (key: keyof OpenTypes, value?: boolean | undefined | null) => {
    setOpen((prev) => ({ ...prev, [key]: value === undefined ? !prev[key] : value }))
  }

  const [selected, setSelected] = useState<SelectedTypes>({
    certifications: null,
    educations: null,
    workExperiences: null
  })

  const handleSelected = (key: keyof OpenTypes, value?: string | null) => {
    setSelected((prev) => ({ ...prev, [key]: value }))
  }

  if (!id) return;

  async function handleEndorseProfile(userId: string | undefined, isEndorse: boolean) {
    if (!resumidActor) throw new Error("Actor is undefined");
    if (!userId) throw new Error("userId is undefined");

    let result;

    if (isEndorse) {
      result = await resumidActor.endorseProfile(userId);
    } else {
      result = await resumidActor.unendorseProfile(userId);
    }

    if ("ok" in result) {
      return { id: userId, message: result.ok };
    } else {
      throw new Error(result.err ?? "Unknown Error");
    }
  }

  async function handleGetProfileDetail(id: string): Promise<ProfileDetailResponse> {
    if (!resumidActor) throw new Error("Actor is undefined");

    const result = await resumidActor.getProfileById(id);
    const { profile: profileRaw, endorsementInfo = [] } = result;
    const _profile = fromNullable(profileRaw);

    console.log("Result raw:", result);

    if (!_profile) return { profile: null, endorsementInfo };

    const profile: ProfileType = {
      profileId: _profile.profileId,
      userId: _profile.userId,
      createdAt: _profile.createdAt,
      updatedAt: _profile.updatedAt,
      contact: (() => {
        const c = fromNullable(_profile.contact);
        return c
          ? {
            twitter: fromNullable(c.twitter),
            instagram: fromNullable(c.instagram),
            email: fromNullable(c.email),
            website: fromNullable(c.website),
            facebook: fromNullable(c.facebook),
            address: fromNullable(c.address),
            phone: fromNullable(c.phone),
          }
          : undefined;
      })(),
      profileDetail: (() => {
        const d = fromNullable(_profile.profileDetail);
        return d
          ? {
            name: fromNullable(d.name),
            description: fromNullable(d.description),
            current_position: fromNullable(d.current_position),
            bannerCid: fromNullable(d.bannerCid),
            profileCid: fromNullable(d.profileCid),
          }
          : undefined;
      })(),
      resume: (() => {
        const r = fromNullable(_profile.resume);
        return r
          ? {
            summary: (() => {
              const content = fromNullable(r.summary)?.content;
              if (!content) return undefined;
              return fromNullable(content) || undefined;
            })(),

            skills: fromNullable(r.skills)?.skills ?? undefined,

            educations: (() => {
              const mapped =
                fromNullable(r.educations)?.map((ed) => ({
                  id: ed.id,
                  period: {
                    start: fromNullable(ed.period.start),
                    end: fromNullable(ed.period.end),
                  },
                  institution: fromNullable(ed.institution),
                  description: fromNullable(ed.description),
                  degree: fromNullable(ed.degree),
                })) ?? [];
              return mapped.length ? sortByPeriod<EducationType>(mapped) : undefined;
            })(),

            workExperiences: (() => {
              const mapped =
                fromNullable(r.workExperiences)?.map((we) => ({
                  id: we.id,
                  period: {
                    start: fromNullable(we.period.start),
                    end: fromNullable(we.period.end),
                  },
                  employment_type: fromNullable(we.employment_type),
                  description: fromNullable(we.description),
                  company: we.company,
                  position: we.position,
                  location: fromNullable(we.location),
                })) ?? [];
              return mapped.length ? sortByPeriod<WorkExperienceType>(mapped) : undefined;
            })(),
          }
          : undefined;
      })(),
      endorsements: fromNullable(_profile.endorsedProfiles) ?? [],
      endorsedProfiles: fromNullable(_profile.endorsedProfiles) ?? [],
      certifications:
        fromNullable(_profile.certificatons)?.map((cert) => ({
          id: cert.id,
          title: cert.title,
          createdAt: cert.createdAt,
          updatedAt: cert.updatedAt,
          credential_url: fromNullable(cert.credential_url),
          issuer: fromNullable(cert.issuer),
        })) ?? undefined,
    };

    return { profile, endorsementInfo };
  }

  const {
    data,
    isLoading,
    error
  } = useQuery<ProfileDetailResponse>({
    queryKey: [KEY, id],
    queryFn: () => handleGetProfileDetail(id),
    retry: 2,
    refetchOnWindowFocus: false
  });

  const { profile: profileDetail, endorsementInfo } = data ?? { profile: null, endorsementInfo: [] };

  if (!isLoading && !profileDetail) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"Profile Not Found | Resumid"}</title>
          <meta name="description" content={`Analysis details for {Name Placeholder}`} />
        </Helmet>

        <div className="min-h-screen flex justify-center items-center">
          <h2 className="text-xl font-outfit font-semibold text-heading">
            This profile does not exists, sorry!
          </h2>
        </div>
      </>
    )
  }

  const currentUserId = userData?.ok?.id?.__principal__;
  const isOwner = !isLoading ? profileDetail!.userId === currentUserId : false;
  
  // TODO: Adjust later
  const hasEndorsed = !isOwner && endorsementInfo?.some((endorsement) => endorsement.endorsedUserId === currentUserId);

  if (error) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"Profile | Resumid"}</title>
          <meta name="description" content={`Analysis details for {Name Placeholder}`} />
        </Helmet>

        <div className="min-h-screen flex justify-center items-center">
          <h2 className="text-xl font-outfit font-semibold text-heading">
            {error?.message || "Error, something happened."}
          </h2>
        </div>
      </>
    )
  }

  const selectedExperience = profileDetail?.resume?.workExperiences?.find((exp: any) => exp.id === selected.workExperiences) ?? null

  const selectedEducation = profileDetail?.resume?.educations?.find((ed: any) => ed.id === selected.educations) ?? null
  const selectedCertification = profileDetail?.certifications?.find((cert: any) => cert.id === selected.certifications) ?? null

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${!isLoading && profileDetail?.profileDetail ? profileDetail!.profileDetail!.name : "Profile"} | Resumid`}</title>
        <meta name="description" content={`Analysis details for {Name Placeholder}`} />
      </Helmet>

      <div className="min-h-screen">
        <ProfileHeader
          queryKey={[KEY, id]}
          detail={profileDetail!}
          loading={isLoading}
          isOwner={isOwner}
          isNewUser={isNewUser}
          onSectionAdd={(key) => {
            handleOpen(key, true);
            if (Object.keys(selected).includes(key)) {
              handleSelected(key, null);
            }
          }}
          onEndorseProfile={() => {
            handleEndorseProfile(profileDetail!.userId, hasEndorsed)
          }}
          isEndorsed={hasEndorsed}
          endorsmentInfo={endorsementInfo}
        />
        <div className="responsive-container py-6 sm:py-8 flex flex-col-reverse sm:flex-row gap-4 sm:gap-8">
          <div className="flex-shrink-0 sm:min-w-[180px] sm:max-w-[280px] w-full flex flex-col gap-6">
            {(profileDetail?.resume?.skills?.length ?? 0) > 0 && (
              <ProfileSkills
                detail={profileDetail!}
                loading={isLoading}
                isOwner={isOwner}
                onEdit={() => handleOpen("skills")}
              />
            )}
            {isOwner && (
              <ProfileAnalytics
                detail={endorsementInfo}
                loading={isLoading}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <ProfileAbout
              detail={profileDetail!}
              loading={isLoading}
              isOwner={isOwner}
              onEdit={() => handleOpen("summary")}
            />
            {(profileDetail?.resume?.workExperiences?.length ?? 0) > 0 && (
              <ProfileExperience
                detail={profileDetail!}
                isOwner={isOwner}
                loading={isLoading}
                onAdd={() => {
                  handleSelected("workExperiences", null)
                  handleOpen("workExperiences", true)
                }}
                onEdit={(id) => {
                  handleSelected("workExperiences", id);
                  handleOpen("workExperiences", true);
                }}
              />
            )}
            {(profileDetail?.resume?.educations?.length ?? 0) > 0 && (
              <ProfileEducation
                detail={profileDetail!}
                isOwner={isOwner}
                loading={isLoading}
                onAdd={() => {
                  handleSelected("educations", null)
                  handleOpen("educations", true)
                }}
                onEdit={(id) => {
                  handleSelected("educations", id);
                  handleOpen("educations", true);
                }}
              />
            )}
            {(profileDetail?.certifications?.length ?? 0) > 0 && (
              <ProfileCertification
                detail={profileDetail!}
                isOwner={isOwner}
                loading={isLoading}
                onAdd={() => {
                  handleSelected("certifications", null)
                  handleOpen("certifications", true)
                }}
                onEdit={(id) => {
                  handleSelected("certifications", id);
                  handleOpen("certifications", true);
                }}
              />
            )}
          </div>
        </div>
        <SkillDialog
          open={open.skills}
          setOpen={() => handleOpen("skills")}
          queryKey={[KEY, id]}
          detail={profileDetail!}
          isNew={!profileDetail?.resume?.skills}
        />
        <AboutDialog
          open={open.summary}
          setOpen={() => handleOpen("summary")}
          queryKey={[KEY, id]}
          detail={profileDetail!}
          isNew={!profileDetail?.resume?.summary}
        />
        <ExperienceDialog
          open={open.workExperiences}
          setOpen={() => handleOpen("workExperiences")}
          queryKey={[KEY, id]}
          isNew={!selected.workExperiences}
          initial={selectedExperience}
          detail={profileDetail!}
        />
        <EducationDialog
          open={open.educations}
          setOpen={() => handleOpen("educations")}
          queryKey={[KEY, id]}
          isNew={!selected.educations}
          initial={selectedEducation}
          detail={profileDetail!}
        />
        <CertificationDialog
          open={open.certifications}
          setOpen={() => handleOpen("certifications")}
          queryKey={[KEY, id]}
          isNew={!selected.certifications}
          initial={selectedCertification}
          detail={profileDetail!}
        />
      </div >
    </>
  );
}