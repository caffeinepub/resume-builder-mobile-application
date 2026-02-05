import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { Certification } from '../../../types/resume';
import { generateId } from '../../../utils/id';

interface CertificationsSectionEditorProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export function CertificationsSectionEditor({ certifications, onChange }: CertificationsSectionEditorProps) {
  const handleAdd = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
    };
    onChange([...certifications, newCertification]);
  };

  const handleRemove = (id: string) => {
    onChange(certifications.filter((c) => c.id !== id));
  };

  const handleChange = (id: string, field: keyof Certification, value: string) => {
    onChange(
      certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {certifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No certifications added yet.</p>
            <p className="text-sm mt-1">Click "Add Certification" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Certification {index + 1}</h4>
                  <Button
                    onClick={() => handleRemove(cert.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                    <Input
                      id={`cert-name-${cert.id}`}
                      value={cert.name}
                      onChange={(e) => handleChange(cert.id, 'name', e.target.value)}
                      placeholder="AWS Certified Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                    <Input
                      id={`cert-issuer-${cert.id}`}
                      value={cert.issuer}
                      onChange={(e) => handleChange(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`cert-date-${cert.id}`}>Issue Date</Label>
                    <Input
                      id={`cert-date-${cert.id}`}
                      type="month"
                      value={cert.date}
                      onChange={(e) => handleChange(cert.id, 'date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`cert-expiry-${cert.id}`}>Expiry Date (optional)</Label>
                    <Input
                      id={`cert-expiry-${cert.id}`}
                      type="month"
                      value={cert.expiryDate || ''}
                      onChange={(e) => handleChange(cert.id, 'expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`cert-credential-${cert.id}`}>Credential ID (optional)</Label>
                    <Input
                      id={`cert-credential-${cert.id}`}
                      value={cert.credentialId || ''}
                      onChange={(e) => handleChange(cert.id, 'credentialId', e.target.value)}
                      placeholder="ABC123XYZ"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
