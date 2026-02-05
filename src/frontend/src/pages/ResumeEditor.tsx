import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetResume, useUpdateResume } from '../hooks/useResumes';
import { Loader2, ArrowLeft, Save, Download, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResumeEditorForm } from '../components/ResumeEditorForm';
import { ResumePreview } from '../components/resume/ResumePreview';
import { ResumePrintView } from '../components/resume/ResumePrintView';
import { exportToPDF } from '../utils/pdfExport';
import type { Resume } from '../types/resume';
import { toast } from 'sonner';

export default function ResumeEditor() {
  const { resumeId } = useParams({ from: '/editor/$resumeId' });
  const navigate = useNavigate();
  const { data: resume, isLoading, isFetched, error } = useGetResume(resumeId);
  const updateResume = useUpdateResume();

  const [draft, setDraft] = useState<Resume | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize or reset draft when resume changes (including when switching between resumes)
  useEffect(() => {
    if (resume) {
      setDraft(resume);
      setHasChanges(false);
    }
  }, [resume?.id, resume?.updatedAt]); // Reset when resume ID or content changes

  const handleSave = async () => {
    if (!draft) {
      toast.error('No resume content to save');
      return;
    }

    try {
      const updatedResume: Resume = {
        ...draft,
        updatedAt: Date.now(),
      };

      await updateResume.mutateAsync(updatedResume);
      setDraft(updatedResume);
      setHasChanges(false);
      toast.success('Resume saved successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save resume';
      console.error('Save error:', error);
      toast.error(errorMessage);
    }
  };

  const handleDownloadPDF = async () => {
    if (!draft) {
      toast.error('No resume content available to export');
      return;
    }

    if (!draft.title || draft.title.trim() === '') {
      toast.error('Please add a title to your resume before exporting');
      return;
    }

    try {
      // If there are unsaved changes, prompt user
      if (hasChanges) {
        const shouldSave = window.confirm(
          'You have unsaved changes. Would you like to save before downloading?'
        );
        if (shouldSave) {
          await handleSave();
        }
      }

      // Export to PDF
      exportToPDF(draft);
      toast.success('Opening print dialog...');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
      console.error('PDF export error:', error);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  const handleDraftChange = (updatedDraft: Resume) => {
    setDraft(updatedDraft);
    setHasChanges(true);
  };

  if (isLoading || !isFetched) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-semibold">Error Loading Resume</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load resume'}
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Resume not found</h2>
          <p className="text-muted-foreground">The resume you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while draft is being initialized
  if (!draft) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Preparing editor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-8 max-w-7xl print:hidden">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Resume</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                disabled={!draft}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateResume.isPending}
              >
                {updateResume.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Unsaved changes warning */}
          {hasChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Remember to save before leaving this page.
              </AlertDescription>
            </Alert>
          )}

          {/* Two-column layout: Editor + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ResumeEditorForm
                resume={draft}
                onChange={handleDraftChange}
              />
            </div>
            <div className="hidden lg:block">
              <ResumePreview resume={draft} />
            </div>
          </div>
        </div>
      </div>

      {/* Print View (hidden on screen, visible when printing) */}
      <ResumePrintView resume={draft} />
    </>
  );
}
