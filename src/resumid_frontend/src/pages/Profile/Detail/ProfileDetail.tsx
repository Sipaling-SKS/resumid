import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { Helmet } from "react-helmet";

import useWindowSize from "@/hooks/useMediaQuery"
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileSkills from "./ProfileSkill";
import ProfileAnalytics from "./ProfileAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileDetailType } from "@/types/profile-types";
import { profileDetailData } from "@/data/profile-detail-data";
import { AboutDialog } from "./Dialog/AboutDialog";
import { SkillDialog } from "./Dialog/SkillDialog";
import { ExperienceDialog } from "./Dialog/ExperienceDialog";
import { EducationDialog } from "./Dialog/EducationDialog";
import ProfileCertification from "./ProfileCertification";
import { CertificationDialog } from "./Dialog/CertificationDialog";

type OpenTypes = {
  sectionMenu: boolean
  about: boolean
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

export default function ProfileDetail() {
  const KEY = "profile"
  const isOwner = true;

  const { id } = useParams()
  const { resumidActor } = useAuth();

  const location = useLocation();
  const { state } = location;
  const isNewUser = state?.isNewUser || false;

  const [open, setOpen] = useState<OpenTypes>({
    sectionMenu: false,
    about: false,
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

  if (!id || !resumidActor) return;

  async function handleGetProfileDetail(id: string | number): Promise<any> {
    const result = await resumidActor.getProfileById(id)
    const { profile } = result;

    if (profile) {
      return result;
    } else {
      throw new Error("Profile not found")
    }
  }

  const {
    data = {},
    isLoading,
    error
  } = useQuery({
    queryKey: ['historyDetail', id],
    queryFn: () => handleGetProfileDetail(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { profile: profileDetail, endorsementInfo = [] } = data;
  // const profileDetail: ProfileDetailType = profile;

  if (error) {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"{Name Placeholder} | Resumid"}</title>
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

  const selectedExperience = profileDetail?.workExperiences?.find((exp: any) => exp.id === selected.workExperiences) ?? {
    id: "",
    company: "",
    position: "",
    description: "",
    employementType: "",
    location: "",
    period: { start: "", end: "" }
  }

  const selectedEducation = profileDetail?.educations?.find((ed: any) => ed.id === selected.educations) ?? {
    id: "",
    institution: "",
    degree: "",
    description: "",
    location: "",
    period: { start: "", end: "" }
  }

  const selectedCertification = profileDetail?.certifications?.find((cert: any) => cert.id === selected.certifications) ?? {
    id: "",
    title: "",
    issuer: "",
    url: "",
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"{Name Placeholder} | Resumid"}</title>
        <meta name="description" content={`Analysis details for {Name Placeholder}`} />
      </Helmet>

      <div className="min-h-screen">
        <ProfileHeader
          queryKey={[KEY, id]}
          detail={profileDetail}
          loading={isLoading}
          isOwner={isOwner}
          isNewUser={isNewUser}
          onSectionAdd={(key) => {
            handleOpen(key, true);
            if (Object.keys(selected).includes(key)) {
              handleSelected(key, null);
            }
          }}
        />
        <div className="responsive-container my-8 flex flex-col-reverse sm:flex-row gap-8">
          <div className="flex-shrink-0 min-w-[180px] max-w-[280px] flex flex-col gap-6">
            {(profileDetail?.skills?.length ?? 0) > 0 && (
              <ProfileSkills
                detail={profileDetail}
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
            {profileDetail?.about ? (
              <ProfileAbout
                detail={profileDetail}
                loading={isLoading}
                isOwner={isOwner}
                onEdit={() => handleOpen("about")}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col gap-3 justify-center items-center p-6 outline-dashed outline-2 outline-neutral-300 outline-offset-1 rounded-lg bg-neutral-50">
                  <p className="font-inter font-paragraph text-sm text-center text-balance">You haven't added about section to your profile, share a brief overview of your professional journey, experience, and skills so people can get to know your strengths and capabilities at a glance.</p>
                  <button className="text-blue-600 font-inter text-sm font-medium hover:underline">
                    Start adding about section
                  </button>
                </CardContent>
              </Card>
            )}
            {(profileDetail?.workExperiences?.length ?? 0) > 0 && (
              <ProfileExperience
                detail={profileDetail}
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
            {(profileDetail?.educations?.length ?? 0) > 0 && (
              <ProfileEducation
                detail={profileDetail}
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
                detail={profileDetail}
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
          detail={profileDetail}
          isNew={!profileDetail?.skills}
        />
        <AboutDialog
          open={open.about}
          setOpen={() => handleOpen("about")}
          queryKey={[KEY, id]}
          detail={profileDetail}
          isNew={!profileDetail?.about}
        />
        <ExperienceDialog
          open={open.workExperiences}
          setOpen={() => handleOpen("workExperiences")}
          queryKey={[KEY, id]}
          isNew={!selected.workExperiences}
          initial={selectedExperience}
          detail={profileDetail}
        />
        <EducationDialog
          open={open.educations}
          setOpen={() => handleOpen("educations")}
          queryKey={[KEY, id]}
          isNew={!selected.educations}
          initial={selectedEducation}
          detail={profileDetail}
        />
        <CertificationDialog
          open={open.certifications}
          setOpen={() => handleOpen("certifications")}
          queryKey={[KEY, id]}
          isNew={!selected.certifications}
          initial={selectedCertification}
          detail={profileDetail}
        />
      </div >
    </>
  );
}