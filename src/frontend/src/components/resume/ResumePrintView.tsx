import { ResumeTemplateRenderer } from './templates/ResumeTemplateRenderer';
import type { Resume } from '../../types/resume';

interface ResumePrintViewProps {
  resume: Resume;
}

export function ResumePrintView({ resume }: ResumePrintViewProps) {
  return (
    <div className="print-only">
      <ResumeTemplateRenderer resume={resume} />
    </div>
  );
}
