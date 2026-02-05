import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { Hobby } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface HobbiesSectionEditorProps {
  hobbies: Hobby[];
  onChange: (hobbies: Hobby[]) => void;
}

export function HobbiesSectionEditor({ hobbies, onChange }: HobbiesSectionEditorProps) {
  const handleAdd = () => {
    const newHobby: Hobby = {
      id: generateId(),
      name: '',
    };
    onChange([...hobbies, newHobby]);
  };

  const handleRemove = (id: string) => {
    onChange(hobbies.filter((h) => h.id !== id));
  };

  const handleChange = (id: string, value: string) => {
    onChange(
      hobbies.map((h) =>
        h.id === id ? { ...h, name: value } : h
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hobbies & Interests</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Hobby
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {hobbies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hobbies added yet.</p>
            <p className="text-sm mt-1">Click "Add Hobby" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hobbies.map((hobby) => (
              <div key={hobby.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`hobby-${hobby.id}`}>Hobby</Label>
                  <Button
                    onClick={() => handleRemove(hobby.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  id={`hobby-${hobby.id}`}
                  value={hobby.name}
                  onChange={(e) => handleChange(hobby.id, e.target.value)}
                  placeholder="e.g., Photography, Hiking"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
