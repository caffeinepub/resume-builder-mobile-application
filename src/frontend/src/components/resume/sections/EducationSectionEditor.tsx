import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import type { Education } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface EducationSectionEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationSectionEditor({ education, onChange }: EducationSectionEditorProps) {
  const handleAdd = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...education, newEducation]);
  };

  const handleRemove = (id: string) => {
    onChange(education.filter((e) => e.id !== id));
  };

  const handleChange = (id: string, field: keyof Education, value: string | boolean) => {
    onChange(
      education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {education.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No education entries yet.</p>
            <p className="text-sm mt-1">Click "Add Education" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  <Button
                    onClick={() => handleRemove(edu.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                    <Input
                      id={`institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                      placeholder="University name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                    <Input
                      id={`degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                    <Input
                      id={`field-${edu.id}`}
                      value={edu.field}
                      onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${edu.id}`}
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                      disabled={edu.current}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id={`current-${edu.id}`}
                      checked={edu.current}
                      onCheckedChange={(checked) =>
                        handleChange(edu.id, 'current', checked === true)
                      }
                    />
                    <Label htmlFor={`current-${edu.id}`} className="cursor-pointer">
                      Currently studying
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${edu.id}`}>Description (optional)</Label>
                  <Textarea
                    id={`description-${edu.id}`}
                    value={edu.description || ''}
                    onChange={(e) => handleChange(edu.id, 'description', e.target.value)}
                    placeholder="Achievements, coursework, GPA, etc."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
