import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useResumes, useCreateResume, useDeleteResume, useDuplicateResume, useRenameResume, useStorageStatus } from '../hooks/useResumes';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileText, MoreVertical, Copy, Pencil, Trash2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { extractErrorMessage, isStorageError, getStorageErrorMessage } from '../utils/errorMessage';

export default function ResumesDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: resumes = [], isLoading } = useResumes();
  const createResume = useCreateResume();
  const deleteResume = useDeleteResume();
  const duplicateResume = useDuplicateResume();
  const renameResume = useRenameResume();
  const { data: storageStatus } = useStorageStatus();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const isAuthenticated = !!identity;
  const storageUnavailable = storageStatus && !storageStatus.available;

  const handleCreate = async () => {
    if (!newResumeTitle.trim()) return;
    
    try {
      const resume = await createResume.mutateAsync(newResumeTitle.trim());
      setShowCreateDialog(false);
      setNewResumeTitle('');
      toast.success('Resume created successfully');
      
      // Navigate to editor
      navigate({ to: '/editor/$resumeId', params: { resumeId: resume.id } });
    } catch (error) {
      const { userMessage, fullError } = extractErrorMessage(error);
      console.error('Failed to create resume:', fullError);
      
      // Show specific error message
      if (isStorageError(error)) {
        toast.error('Storage Unavailable', {
          description: getStorageErrorMessage(),
          duration: 8000,
        });
      } else {
        toast.error('Failed to create resume', {
          description: userMessage,
          duration: 5000,
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume.mutateAsync(id);
        toast.success('Resume deleted');
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to delete resume:', fullError);
        toast.error('Failed to delete resume', {
          description: userMessage,
        });
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateResume.mutateAsync(id);
      toast.success('Resume duplicated');
    } catch (error) {
      const { userMessage, fullError } = extractErrorMessage(error);
      console.error('Failed to duplicate resume:', fullError);
      toast.error('Failed to duplicate resume', {
        description: userMessage,
      });
    }
  };

  const handleRename = async () => {
    if (!selectedResumeId || !renameTitle.trim()) return;
    try {
      await renameResume.mutateAsync({ id: selectedResumeId, newTitle: renameTitle.trim() });
      setShowRenameDialog(false);
      setSelectedResumeId(null);
      setRenameTitle('');
      toast.success('Resume renamed');
    } catch (error) {
      const { userMessage, fullError } = extractErrorMessage(error);
      console.error('Failed to rename resume:', fullError);
      toast.error('Failed to rename resume', {
        description: userMessage,
      });
    }
  };

  const openRenameDialog = (id: string, currentTitle: string) => {
    setSelectedResumeId(id);
    setRenameTitle(currentTitle);
    setShowRenameDialog(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Storage Warning */}
      {storageUnavailable && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Local Storage Unavailable</AlertTitle>
          <AlertDescription>
            Your browser's local storage is currently unavailable. This may be due to private browsing mode or storage restrictions. 
            {isAuthenticated 
              ? ' Your resumes are synced to the cloud, but local changes may not persist.' 
              : ' Please disable private mode or log in to save your resumes.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border/50 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Build Your Perfect Resume
          </h1>
          <p className="text-lg text-muted-foreground">
            Create professional, ATS-friendly resumes with our free templates. No subscriptions, no hidden fees.
            {!isAuthenticated && ' Start as a guest or login to sync across devices.'}
          </p>
          <Button size="lg" onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Resume
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden lg:block">
          <img
            src="/assets/generated/hero.dim_1600x900.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Resumes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your Resumes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {resumes.length === 0
                ? 'No resumes yet. Create your first one!'
                : `${resumes.length} resume${resumes.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Get started by creating your first resume. Choose from our free professional templates.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{resume.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatDate(resume.updatedAt)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openRenameDialog(resume.id, resume.title)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(resume.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(resume.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resume.content.summary || 'No summary yet'}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate({ to: '/editor/$resumeId', params: { resumeId: resume.id } })}
                  >
                    Edit Resume
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setNewResumeTitle('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>Give your resume a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Resume"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newResumeTitle.trim() && !createResume.isPending) {
                    handleCreate();
                  }
                }}
                disabled={createResume.isPending}
              />
            </div>
            {storageUnavailable && !isAuthenticated && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Local storage is unavailable. Please log in to save your resume to the cloud.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateDialog(false)}
              disabled={createResume.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!newResumeTitle.trim() || createResume.isPending}
            >
              {createResume.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={(open) => {
        setShowRenameDialog(open);
        if (!open) {
          setSelectedResumeId(null);
          setRenameTitle('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>Enter a new name for your resume.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename">Resume Title</Label>
              <Input
                id="rename"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && renameTitle.trim() && !renameResume.isPending) {
                    handleRename();
                  }
                }}
                disabled={renameResume.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRenameDialog(false)}
              disabled={renameResume.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRename} 
              disabled={!renameTitle.trim() || renameResume.isPending}
            >
              {renameResume.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
