import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { Language } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface LanguagesSectionEditorProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export function LanguagesSectionEditor({ languages, onChange }: LanguagesSectionEditorProps) {
  const handleAdd = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: '',
      proficiency: '',
    };
    onChange([...languages, newLanguage]);
  };

  const handleRemove = (id: string) => {
    onChange(languages.filter((l) => l.id !== id));
  };

  const handleChange = (id: string, field: keyof Language, value: string) => {
    onChange(
      languages.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Languages</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {languages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No languages added yet.</p>
            <p className="text-sm mt-1">Click "Add Language" to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {languages.map((lang) => (
              <div key={lang.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`lang-name-${lang.id}`}>Language</Label>
                  <Button
                    onClick={() => handleRemove(lang.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  id={`lang-name-${lang.id}`}
                  value={lang.name}
                  onChange={(e) => handleChange(lang.id, 'name', e.target.value)}
                  placeholder="e.g., English, Spanish"
                />
                <div className="space-y-2">
                  <Label htmlFor={`lang-prof-${lang.id}`}>Proficiency</Label>
                  <Input
                    id={`lang-prof-${lang.id}`}
                    value={lang.proficiency}
                    onChange={(e) => handleChange(lang.id, 'proficiency', e.target.value)}
                    placeholder="Native, Fluent, Intermediate"
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
