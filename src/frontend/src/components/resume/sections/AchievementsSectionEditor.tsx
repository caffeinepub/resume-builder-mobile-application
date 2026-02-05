import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { Achievement } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface AchievementsSectionEditorProps {
  achievements: Achievement[];
  onChange: (achievements: Achievement[]) => void;
}

export function AchievementsSectionEditor({ achievements, onChange }: AchievementsSectionEditorProps) {
  const handleAdd = () => {
    const newAchievement: Achievement = {
      id: generateId(),
      title: '',
      description: '',
      date: '',
    };
    onChange([...achievements, newAchievement]);
  };

  const handleRemove = (id: string) => {
    onChange(achievements.filter((a) => a.id !== id));
  };

  const handleChange = (id: string, field: keyof Achievement, value: string) => {
    onChange(
      achievements.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Achievements</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No achievements added yet.</p>
            <p className="text-sm mt-1">Click "Add Achievement" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Achievement {index + 1}</h4>
                  <Button
                    onClick={() => handleRemove(achievement.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`achievement-title-${achievement.id}`}>Title</Label>
                    <Input
                      id={`achievement-title-${achievement.id}`}
                      value={achievement.title}
                      onChange={(e) => handleChange(achievement.id, 'title', e.target.value)}
                      placeholder="Award or achievement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`achievement-date-${achievement.id}`}>Date (optional)</Label>
                    <Input
                      id={`achievement-date-${achievement.id}`}
                      type="month"
                      value={achievement.date || ''}
                      onChange={(e) => handleChange(achievement.id, 'date', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`achievement-desc-${achievement.id}`}>Description</Label>
                  <Textarea
                    id={`achievement-desc-${achievement.id}`}
                    value={achievement.description}
                    onChange={(e) => handleChange(achievement.id, 'description', e.target.value)}
                    placeholder="Describe the achievement..."
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
