import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeTemplateRenderer } from './templates/ResumeTemplateRenderer';
import type { Resume } from '../../types/resume';

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="scale-[0.5] origin-top-left w-[200%]">
            <ResumeTemplateRenderer resume={resume} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
