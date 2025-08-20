export type PeriodType = {
  start: string
  end?: string
}

export type EducationType = {
  id: string
  institution: string
  degree: string
  description?: string
  location?: string
  period: PeriodType
}

export type WorkExperienceType = {
  id: string
  company: string
  location?: string
  employementType?: string
  description?: string
  position: string
  period: PeriodType
}

export type CertificationType = {
  id: string
  title: string
  issuer: string
  url?: string
}

export type ProfileDetailSectionType = {
  name: string
  currentPosition?: string
  description?: string
  avatarCid?: string
  bannerCid?: string
}

export type ContactType = {
  email?: string
  phoneNumber?: string
  facebook?: string
  instagram?: string
  x?: string
  website?: string
}

export type ProfileDetailType = {
  id: string | number
  profileDetail?: ProfileDetailSectionType
  contactDetail?: ContactType
  about?: string
  workExperiences?: WorkExperienceType[]
  educations?: EducationType[]
  skills?: string[]
  certifications?: CertificationType[]
}