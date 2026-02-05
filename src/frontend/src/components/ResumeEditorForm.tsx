import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EducationSectionEditor } from './resume/sections/EducationSectionEditor';
import { ExperienceSectionEditor } from './resume/sections/ExperienceSectionEditor';
import { SkillsSectionEditor } from './resume/sections/SkillsSectionEditor';
import { ProjectsSectionEditor } from './resume/sections/ProjectsSectionEditor';
import { CertificationsSectionEditor } from './resume/sections/CertificationsSectionEditor';
import { LanguagesSectionEditor } from './resume/sections/LanguagesSectionEditor';
import { AchievementsSectionEditor } from './resume/sections/AchievementsSectionEditor';
import { HobbiesSectionEditor } from './resume/sections/HobbiesSectionEditor';
import { ResumeFormattingPanel } from './resume/ResumeFormattingPanel';
import type { Resume } from '../types/resume';

interface ResumeEditorFormProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

export function ResumeEditorForm({ resume, onChange }: ResumeEditorFormProps) {
  const handleTitleChange = (title: string) => {
    onChange({ ...resume, title });
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...resume,
      content: {
        ...resume.content,
        personalInfo: {
          ...resume.content.personalInfo,
          [field]: value,
        },
      },
    });
  };

  const handleSummaryChange = (summary: string) => {
    onChange({
      ...resume,
      content: {
        ...resume.content,
        summary,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Resume Title */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={resume.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={resume.content.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resume.content.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={resume.content.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resume.content.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                value={resume.content.personalInfo.linkedIn || ''}
                onChange={(e) => handlePersonalInfoChange('linkedIn', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                value={resume.content.personalInfo.website || ''}
                onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                placeholder="johndoe.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={resume.content.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Write a brief professional summary highlighting your key skills and experience..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              A concise overview of your professional background and career objectives.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certs</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="achievements">Awards</TabsTrigger>
          <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="mt-6">
          <ExperienceSectionEditor
            experience={resume.content.experience}
            onChange={(experience) =>
              onChange({
                ...resume,
                content: { ...resume.content, experience },
              })
            }
          />
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <EducationSectionEditor
            education={resume.content.education}
            onChange={(education) =>
              onChange({
                ...resume,
                content: { ...resume.content, education },
              })
            }
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsSectionEditor
            skills={resume.content.skills}
            onChange={(skills) =>
              onChange({
                ...resume,
                content: { ...resume.content, skills },
              })
            }
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsSectionEditor
            projects={resume.content.projects}
            onChange={(projects) =>
              onChange({
                ...resume,
                content: { ...resume.content, projects },
              })
            }
          />
        </TabsContent>

        <TabsContent value="certifications" className="mt-6">
          <CertificationsSectionEditor
            certifications={resume.content.certifications}
            onChange={(certifications) =>
              onChange({
                ...resume,
                content: { ...resume.content, certifications },
              })
            }
          />
        </TabsContent>

        <TabsContent value="languages" className="mt-6">
          <LanguagesSectionEditor
            languages={resume.content.languages}
            onChange={(languages) =>
              onChange({
                ...resume,
                content: { ...resume.content, languages },
              })
            }
          />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <AchievementsSectionEditor
            achievements={resume.content.achievements}
            onChange={(achievements) =>
              onChange({
                ...resume,
                content: { ...resume.content, achievements },
              })
            }
          />
        </TabsContent>

        <TabsContent value="hobbies" className="mt-6">
          <HobbiesSectionEditor
            hobbies={resume.content.hobbies}
            onChange={(hobbies) =>
              onChange({
                ...resume,
                content: { ...resume.content, hobbies },
              })
            }
          />
        </TabsContent>
      </Tabs>

      {/* Formatting Panel */}
      <ResumeFormattingPanel
        formatting={resume.formatting}
        onChange={(formatting) =>
          onChange({
            ...resume,
            formatting,
          })
        }
      />
    </div>
  );
}
