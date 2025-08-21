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
import { AboutDialog } from "./Dialog/AboutDialog";
import { SkillDialog } from "./Dialog/SkillDialog";
import { ExperienceDialog } from "./Dialog/ExperienceDialog";
import { EducationDialog } from "./Dialog/EducationDialog";
import ProfileCertification from "./ProfileCertification";
import { CertificationDialog } from "./Dialog/CertificationDialog";
import { fromNullable } from "@/lib/optionalField";

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

  const { id } = useParams()
  const { resumidActor, userData } = useAuth();

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

  if (!id) return;

  async function handleGetProfileDetail(id: string): Promise<any> {
    if (!resumidActor) throw new Error("Actor is undefined");

    const result = await resumidActor.getProfileById(id)
    const { profile: profileRaw, endorsementInfo = [] } = result;

    const _profile = fromNullable(profileRaw)

    if (_profile) {
      const profile = {
        profileId: _profile.profileId,
        userId: _profile.userId,
        createdAt: _profile.createdAt,
        updatedAt: _profile.updatedAt,

        // unwrap contact
        contact: (() => {
          const contact = fromNullable(_profile.contact)
          if (!contact) return null
          return {
            twitter: fromNullable(contact.twitter),
            instagram: fromNullable(contact.instagram),
            email: fromNullable(contact.email),
            website: fromNullable(contact.website),
            facebook: fromNullable(contact.facebook),
            address: fromNullable(contact.address),
            phone: fromNullable(contact.phone),
          }
        })(),

        // unwrap profileDetail
        profileDetail: (() => {
          const detail = fromNullable(_profile.profileDetail)
          if (!detail) return null
          return {
            name: fromNullable(detail.name),
            description: fromNullable(detail.description),
            current_position: fromNullable(detail.current_position),
            bannerCid: fromNullable(detail.bannerCid),
            profileCid: fromNullable(detail.profileCid),
          }
        })(),

        // unwrap resume
        resume: (() => {
          const resume = fromNullable(_profile.resume)
          if (!resume) return null

          return {
            summary: (() => {
              const content = fromNullable(resume.summary)?.content;
              if (!content) return null;
              return fromNullable(content) || null;
            })(),
            skills: fromNullable(resume.skills)?.skills ?? undefined,

            educations: fromNullable(resume.educations)?.map((edu) => ({
              id: edu.id,
              period: {
                start: fromNullable(edu.period.start),
                end: fromNullable(edu.period.end),
              },
              institution: fromNullable(edu.institution),
              description: fromNullable(edu.description),
              degree: fromNullable(edu.degree),
            })) ?? undefined,

            workExperiences: fromNullable(resume.workExperiences)?.map((we) => ({
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
            })) ?? undefined,
          }
        })(),

        // unwrap endorsements & endorsedProfiles
        endorsements: fromNullable(_profile.endorsedProfiles) ?? [],
        endorsedProfiles: fromNullable(_profile.endorsedProfiles) ?? [],

        // unwrap certifications
        certificatons: fromNullable(_profile.certificatons)?.map((cert) => ({
          id: cert.id,
          title: cert.title,
          createdAt: cert.createdAt,
          updatedAt: cert.updatedAt,
          credential_url: fromNullable(cert.credential_url),
          issuer: fromNullable(cert.issuer),
        })) ?? undefined,
      }

      return { profile, endorsementInfo };
    } else {
      throw new Error("Profile not found")
    }
  }

  const {
    data = {},
    isLoading,
    error
  } = useQuery({
    queryKey: [KEY, id],
    queryFn: () => handleGetProfileDetail(id),
    retry: 2,
    refetchOnWindowFocus: false
  });

  const { profile: profileDetail, endorsementInfo = [] } = data;
  const isOwner = !isLoading ? profileDetail.userId === userData?.ok?.id?.__principal__ : false;

  console.log(profileDetail);

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
        <title>{`${isLoading ? "Profile" : profileDetail.profileDetail.name} | Resumid`}</title>
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
        <div className="responsive-container py-8 flex flex-col-reverse sm:flex-row gap-8">
          <div className="flex-shrink-0 min-w-[180px] max-w-[280px] flex flex-col gap-6">
            {(profileDetail?.resume?.skills?.length ?? 0) > 0 && (
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
            <ProfileAbout
              detail={profileDetail}
              loading={isLoading}
              isOwner={isOwner}
              onEdit={() => handleOpen("about")}
            />
            {(profileDetail?.resume?.workExperiences?.length ?? 0) > 0 && (
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
            {(profileDetail?.resume?.educations?.length ?? 0) > 0 && (
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
          isNew={!profileDetail?.resume?.skills}
        />
        <AboutDialog
          open={open.about}
          setOpen={() => handleOpen("about")}
          queryKey={[KEY, id]}
          detail={profileDetail}
          isNew={!profileDetail?.resume?.summary}
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