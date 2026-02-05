import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ResumeFormatting } from '../../types/resume';

interface ResumeFormattingPanelProps {
  formatting: ResumeFormatting;
  onChange: (formatting: ResumeFormatting) => void;
}

const TEMPLATES = [
  { value: 'modern', label: 'Modern', thumb: '/assets/generated/template-modern-thumb.dim_600x800.png' },
  { value: 'minimal', label: 'Minimal', thumb: '/assets/generated/template-minimal-thumb.dim_600x800.png' },
  { value: 'creative', label: 'Creative', thumb: '/assets/generated/template-creative-thumb.dim_600x800.png' },
  { value: 'professional', label: 'Professional', thumb: '/assets/generated/template-professional-thumb.dim_600x800.png' },
  { value: 'ats', label: 'ATS-Friendly', thumb: '/assets/generated/template-ats-thumb.dim_600x800.png' },
] as const;

const FONTS = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'lora', label: 'Lora' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'source-sans', label: 'Source Sans Pro' },
] as const;

const COLOR_THEMES = [
  { value: 'emerald', label: 'Emerald', color: 'oklch(0.52 0.14 165)' },
  { value: 'slate', label: 'Slate', color: 'oklch(0.45 0.02 240)' },
  { value: 'amber', label: 'Amber', color: 'oklch(0.65 0.18 75)' },
  { value: 'rose', label: 'Rose', color: 'oklch(0.60 0.20 15)' },
  { value: 'blue', label: 'Blue', color: 'oklch(0.55 0.18 240)' },
] as const;

export function ResumeFormattingPanel({ formatting, onChange }: ResumeFormattingPanelProps) {
  const handleTemplateChange = (template: ResumeFormatting['template']) => {
    onChange({ ...formatting, template });
  };

  const handleFontChange = (font: ResumeFormatting['font']) => {
    onChange({ ...formatting, font });
  };

  const handleColorThemeChange = (colorTheme: ResumeFormatting['colorTheme']) => {
    onChange({ ...formatting, colorTheme });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formatting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-3">
          <Label>Template</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.value}
                onClick={() => handleTemplateChange(template.value)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  formatting.template === template.value
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={template.thumb}
                  alt={template.label}
                  className="w-full h-auto aspect-[3/4] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2 text-xs font-medium text-center">
                  {template.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-2">
          <Label htmlFor="font-select">Font</Label>
          <Select value={formatting.font} onValueChange={handleFontChange}>
            <SelectTrigger id="font-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Theme Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-theme-select">Color Theme</Label>
          <Select value={formatting.colorTheme} onValueChange={handleColorThemeChange}>
            <SelectTrigger id="color-theme-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLOR_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.color }}
                    />
                    {theme.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
