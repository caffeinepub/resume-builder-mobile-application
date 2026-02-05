import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useBackendResumes() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['backendResumes', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getAllResumesForUser(principal);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useCreateBackendResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeId, title, content }: { resumeId: string; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createResume(resumeId, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backendResumes'] });
    },
  });
}

export function useUpdateBackendResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeId, content, title }: { resumeId: string; content: string; title: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateResume(resumeId, content, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backendResumes'] });
    },
  });
}

export function useDeleteBackendResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteResume(resumeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backendResumes'] });
    },
  });
}

export function useDuplicateBackendResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ originalId, newId }: { originalId: string; newId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.duplicateResume(originalId, newId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backendResumes'] });
    },
  });
}

export function useRenameBackendResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeId, newTitle }: { resumeId: string; newTitle: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.renameResume(resumeId, newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backendResumes'] });
    },
  });
}
