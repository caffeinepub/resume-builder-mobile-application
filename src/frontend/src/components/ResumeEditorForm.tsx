import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    </div>
  );
}
