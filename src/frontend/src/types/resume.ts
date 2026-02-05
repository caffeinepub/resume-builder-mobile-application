export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  profilePhoto?: string; // base64 data URL
  photoShape?: 'square' | 'round';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface Hobby {
  id: string;
  name: string;
}

export type SectionType =
  | 'summary'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'hobbies';

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  hobbies: Hobby[];
}

export interface ResumeFormatting {
  template: 'modern' | 'minimal' | 'creative' | 'professional' | 'ats';
  font: 'inter' | 'roboto' | 'lora' | 'playfair' | 'source-sans';
  colorTheme: 'emerald' | 'slate' | 'amber' | 'rose' | 'blue';
  sectionOrder: SectionType[];
}

export interface Resume {
  id: string;
  title: string;
  content: ResumeContent;
  formatting: ResumeFormatting;
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_SECTION_ORDER: SectionType[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
  'hobbies',
];

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    photoShape: 'round',
  },
  summary: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  hobbies: [],
};

export const DEFAULT_RESUME_FORMATTING: ResumeFormatting = {
  template: 'modern',
  font: 'inter',
  colorTheme: 'emerald',
  sectionOrder: DEFAULT_SECTION_ORDER,
};
