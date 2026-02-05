import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetResume, useUpdateResume } from '../hooks/useResumes';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ResumeEditorForm } from '../components/ResumeEditorForm';
import type { Resume } from '../types/resume';
import { toast } from 'sonner';

export default function ResumeEditor() {
  const { resumeId } = useParams({ from: '/editor/$resumeId' });
  const navigate = useNavigate();
  const { data: resume, isLoading, isFetched } = useGetResume(resumeId);
  const updateResume = useUpdateResume();

  const [draft, setDraft] = useState<Resume | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize draft when resume loads
  useEffect(() => {
    if (resume && !draft) {
      setDraft(resume);
    }
  }, [resume, draft]);

  const handleSave = async () => {
    if (!draft) return;

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
      toast.error(error instanceof Error ? error.message : 'Failed to save resume');
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

  if (!resume) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Resume not found</h2>
          <p className="text-muted-foreground">The resume you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return null;
  }

  return (
    <div className="container py-8 max-w-5xl">
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

        {/* Editor Form */}
        <ResumeEditorForm
          resume={draft}
          onChange={handleDraftChange}
        />
      </div>
    </div>
  );
}
