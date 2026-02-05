import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill, SkillLevel } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface SkillsSectionEditorProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function SkillsSectionEditor({ skills, onChange }: SkillsSectionEditorProps) {
  const handleAdd = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 'Intermediate',
    };
    onChange([...skills, newSkill]);
  };

  const handleRemove = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleChange = (id: string, field: keyof Skill, value: string) => {
    onChange(
      skills.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Skills</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet.</p>
            <p className="text-sm mt-1">Click "Add Skill" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`skill-name-${skill.id}`}>Skill</Label>
                  <Button
                    onClick={() => handleRemove(skill.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  id={`skill-name-${skill.id}`}
                  value={skill.name}
                  onChange={(e) => handleChange(skill.id, 'name', e.target.value)}
                  placeholder="e.g., JavaScript, Python"
                />
                <div className="space-y-2">
                  <Label htmlFor={`skill-level-${skill.id}`}>Proficiency Level</Label>
                  <Select
                    value={skill.level}
                    onValueChange={(value) => handleChange(skill.id, 'level', value)}
                  >
                    <SelectTrigger id={`skill-level-${skill.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
