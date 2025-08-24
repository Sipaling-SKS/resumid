export interface ProfileType {
  userId: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;

  resume?: ResumeDataType;
  contact?: ContactInfoType;
  certifications?: CertificateType[];
  profileDetail?: ProfileDetailType;
}

export interface EndorsementBasicInfo {
  profileId: string,
  name: string,
  avatar?: string
}

// Resume
export interface ResumeDataType {
  educations?: EducationType[];
  summary?: string;
  skills?: string[];
  workExperiences?: WorkExperienceType[];
}

// Profile detail
export interface ProfileDetailType {
  name?: string;
  description?: string;
  current_position?: string;
  bannerCid?: string;
  profileCid?: string;
}

// Contact info
export interface ContactInfoType {
  twitter?: string;
  instagram?: string;
  email?: string;
  website?: string;
  facebook?: string;
  address?: string;
  phone?: string;
}

// Skills and summary
export interface SkillsType {
  skills: string[];
}

// Work experience
export interface WorkExperienceType {
  id: string;
  period: {
    start?: string;
    end?: string;
  };
  employment_type?: string;
  description?: string;
  company: string;
  position: string;
  location?: string;
}

// Education
export interface EducationType {
  id: string;
  period: {
    start?: string;
    end?: string;
  };
  institution?: string;
  description?: string;
  degree?: string;
}

// Certificates
export interface CertificateType {
  id: string;
  title: string;
  credential_url?: string;
  issuer?: string;
}