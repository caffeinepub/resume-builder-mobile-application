import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useOnlineStatus } from './useOnlineStatus';
import {
  getAllLocalResumes,
  getLocalResume,
  saveLocalResume,
  deleteLocalResume,
  createLocalResume,
  duplicateLocalResume,
  renameLocalResume,
  checkStorageAvailability,
} from '../storage/resumeLocalStore';
import {
  useBackendResumes,
  useCreateBackendResume,
  useUpdateBackendResume,
  useDeleteBackendResume,
  useDuplicateBackendResume,
  useRenameBackendResume,
} from './useQueries';
import { addToSyncQueue, getSyncQueue, clearSyncQueue } from '../storage/resumeSyncQueue';
import { extractErrorMessage, isStorageError, getStorageErrorMessage } from '../utils/errorMessage';
import type { Resume } from '../types/resume';

export function useResumes() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const isAuthenticated = !!identity;

  const { data: backendResumes = [], isLoading: backendLoading } = useBackendResumes();

  return useQuery({
    queryKey: ['allResumes', isAuthenticated],
    queryFn: async () => {
      const localResumes = getAllLocalResumes();
      if (!isAuthenticated) {
        return localResumes;
      }
      const backendResumeMap = new Map(
        backendResumes.map((br) => {
          const content = JSON.parse(br.content);
          const resume: Resume = {
            id: br.id,
            title: br.title,
            content: content.content,
            formatting: content.formatting,
            createdAt: content.createdAt || Date.now(),
            updatedAt: content.updatedAt || Date.now(),
          };
          return [br.id, resume];
        })
      );
      const merged = [...backendResumeMap.values()];
      const localOnlyResumes = localResumes.filter((lr) => lr.id.startsWith('local_'));
      return [...merged, ...localOnlyResumes];
    },
    enabled: !isAuthenticated || !backendLoading,
  });
}

export function useGetResume(id: string) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: backendResumes = [] } = useBackendResumes();

  return useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const localResume = getLocalResume(id);
      if (!isAuthenticated || id.startsWith('local_')) {
        return localResume;
      }
      const backendResume = backendResumes.find((br) => br.id === id);
      if (backendResume) {
        const content = JSON.parse(backendResume.content);
        const resume: Resume = {
          id: backendResume.id,
          title: backendResume.title,
          content: content.content,
          formatting: content.formatting,
          createdAt: content.createdAt || Date.now(),
          updatedAt: content.updatedAt || Date.now(),
        };
        return resume;
      }
      return localResume;
    },
    // Don't show stale data briefly - wait for fresh data
    staleTime: 0,
  });
}

export function useCreateResume() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const createBackend = useCreateBackendResume();

  return useMutation({
    mutationFn: async (title: string) => {
      // Step 1: Always create locally first
      let resume: Resume;
      try {
        resume = createLocalResume(title);
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to create local resume:', fullError);
        
        if (isStorageError(error)) {
          throw new Error(getStorageErrorMessage());
        }
        throw new Error(`Failed to create resume locally: ${userMessage}`);
      }

      // Step 2: Try to sync to backend if authenticated and online
      if (identity && isOnline) {
        try {
          const content = JSON.stringify({ 
            content: resume.content, 
            formatting: resume.formatting, 
            createdAt: resume.createdAt, 
            updatedAt: resume.updatedAt 
          });
          await createBackend.mutateAsync({ resumeId: resume.id, title, content });
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Failed to sync resume to backend (will retry later):', fullError);
          
          // Queue for later sync but don't fail the operation
          addToSyncQueue({ 
            type: 'create', 
            resumeId: resume.id, 
            data: { title, content: resume } 
          });
          
          // Log warning but don't throw - local creation succeeded
          console.warn('Resume created locally, backend sync queued:', userMessage);
        }
      }

      return resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
    },
    onError: (error) => {
      const { fullError } = extractErrorMessage(error);
      console.error('Create resume mutation failed:', fullError);
    },
  });
}

export function useUpdateResume() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const updateBackend = useUpdateBackendResume();

  return useMutation({
    mutationFn: async (resume: Resume) => {
      try {
        saveLocalResume(resume);
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to save resume locally:', fullError);
        
        if (isStorageError(error)) {
          throw new Error(getStorageErrorMessage());
        }
        throw new Error(`Failed to save resume: ${userMessage}`);
      }

      if (identity && isOnline && !resume.id.startsWith('local_')) {
        try {
          const content = JSON.stringify({ 
            content: resume.content, 
            formatting: resume.formatting, 
            createdAt: resume.createdAt, 
            updatedAt: resume.updatedAt 
          });
          await updateBackend.mutateAsync({ resumeId: resume.id, content, title: resume.title });
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Failed to sync update to backend:', fullError);
          addToSyncQueue({ type: 'update', resumeId: resume.id, data: resume });
          console.warn('Update queued for sync:', userMessage);
        }
      }
    },
    onSuccess: (_, resume) => {
      // Immediately update the cache for the specific resume
      queryClient.setQueryData(['resume', resume.id], resume);
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', resume.id] });
    },
  });
}

export function useDeleteResume() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const deleteBackend = useDeleteBackendResume();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        deleteLocalResume(id);
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to delete local resume:', fullError);
        throw new Error(`Failed to delete resume: ${userMessage}`);
      }

      if (identity && isOnline && !id.startsWith('local_')) {
        try {
          await deleteBackend.mutateAsync(id);
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Failed to delete from backend:', fullError);
          addToSyncQueue({ type: 'delete', resumeId: id });
          console.warn('Delete queued for sync:', userMessage);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
    },
  });
}

export function useDuplicateResume() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const duplicateBackend = useDuplicateBackendResume();

  return useMutation({
    mutationFn: async (id: string) => {
      let duplicate: Resume | null;
      try {
        duplicate = duplicateLocalResume(id);
        if (!duplicate) throw new Error('Resume not found');
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to duplicate locally:', fullError);
        throw new Error(`Failed to duplicate resume: ${userMessage}`);
      }

      if (identity && isOnline && !id.startsWith('local_')) {
        try {
          await duplicateBackend.mutateAsync({ originalId: id, newId: duplicate.id });
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Failed to sync duplicate to backend:', fullError);
          addToSyncQueue({ type: 'duplicate', resumeId: id, data: { newId: duplicate.id } });
          console.warn('Duplicate queued for sync:', userMessage);
        }
      }
      return duplicate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
    },
  });
}

export function useRenameResume() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const renameBackend = useRenameBackendResume();

  return useMutation({
    mutationFn: async ({ id, newTitle }: { id: string; newTitle: string }) => {
      try {
        renameLocalResume(id, newTitle);
      } catch (error) {
        const { userMessage, fullError } = extractErrorMessage(error);
        console.error('Failed to rename locally:', fullError);
        throw new Error(`Failed to rename resume: ${userMessage}`);
      }

      if (identity && isOnline && !id.startsWith('local_')) {
        try {
          await renameBackend.mutateAsync({ resumeId: id, newTitle });
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Failed to sync rename to backend:', fullError);
          addToSyncQueue({ type: 'rename', resumeId: id, data: { newTitle } });
          console.warn('Rename queued for sync:', userMessage);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
    },
  });
}

export function useSyncPendingChanges() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const createBackend = useCreateBackendResume();
  const updateBackend = useUpdateBackendResume();
  const deleteBackend = useDeleteBackendResume();
  const duplicateBackend = useDuplicateBackendResume();
  const renameBackend = useRenameBackendResume();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!identity || !isOnline) return;
      const queue = getSyncQueue();
      for (const op of queue) {
        try {
          switch (op.type) {
            case 'create': {
              const resume = op.data.content as Resume;
              const content = JSON.stringify({ 
                content: resume.content, 
                formatting: resume.formatting, 
                createdAt: resume.createdAt, 
                updatedAt: resume.updatedAt 
              });
              await createBackend.mutateAsync({ resumeId: op.resumeId, title: op.data.title, content });
              break;
            }
            case 'update': {
              const resume = op.data as Resume;
              const content = JSON.stringify({ 
                content: resume.content, 
                formatting: resume.formatting, 
                createdAt: resume.createdAt, 
                updatedAt: resume.updatedAt 
              });
              await updateBackend.mutateAsync({ resumeId: op.resumeId, content, title: resume.title });
              break;
            }
            case 'delete':
              await deleteBackend.mutateAsync(op.resumeId);
              break;
            case 'duplicate':
              await duplicateBackend.mutateAsync({ originalId: op.resumeId, newId: op.data.newId });
              break;
            case 'rename':
              await renameBackend.mutateAsync({ resumeId: op.resumeId, newTitle: op.data.newTitle });
              break;
          }
        } catch (error) {
          const { userMessage, fullError } = extractErrorMessage(error);
          console.error('Sync error for operation:', op.type, fullError);
          console.error('Error message:', userMessage);
        }
      }
      clearSyncQueue();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allResumes'] });
    },
  });
}

/**
 * Hook to check storage availability status
 */
export function useStorageStatus() {
  return useQuery({
    queryKey: ['storageStatus'],
    queryFn: () => checkStorageAvailability(),
    staleTime: 30000, // Check every 30 seconds
  });
}
