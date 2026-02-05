import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface ProjectsSectionEditorProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSectionEditor({ projects, onChange }: ProjectsSectionEditorProps) {
  const handleAdd = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
    };
    onChange([...projects, newProject]);
  };

  const handleRemove = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleChange = (id: string, field: keyof Project, value: string) => {
    onChange(
      projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet.</p>
            <p className="text-sm mt-1">Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <Button
                    onClick={() => handleRemove(project.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`project-name-${project.id}`}>Project Name</Label>
                    <Input
                      id={`project-name-${project.id}`}
                      value={project.name}
                      onChange={(e) => handleChange(project.id, 'name', e.target.value)}
                      placeholder="Project title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-link-${project.id}`}>Link (optional)</Label>
                    <Input
                      id={`project-link-${project.id}`}
                      value={project.link || ''}
                      onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-start-${project.id}`}>Start Date (optional)</Label>
                    <Input
                      id={`project-start-${project.id}`}
                      type="month"
                      value={project.startDate || ''}
                      onChange={(e) => handleChange(project.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`project-end-${project.id}`}>End Date (optional)</Label>
                    <Input
                      id={`project-end-${project.id}`}
                      type="month"
                      value={project.endDate || ''}
                      onChange={(e) => handleChange(project.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-tech-${project.id}`}>Technologies (optional)</Label>
                  <Input
                    id={`project-tech-${project.id}`}
                    value={project.technologies || ''}
                    onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-desc-${project.id}`}>Description</Label>
                  <Textarea
                    id={`project-desc-${project.id}`}
                    value={project.description}
                    onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                    placeholder="Describe the project and your contributions..."
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
