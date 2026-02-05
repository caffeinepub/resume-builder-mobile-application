import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import ProfileSetupDialog from './ProfileSetupDialog';
import { useSyncPendingChanges } from '../hooks/useResumes';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AppLayout() {
  const isOnline = useOnlineStatus();
  const { identity } = useInternetIdentity();
  const syncPending = useSyncPendingChanges();

  useEffect(() => {
    if (isOnline && identity && !syncPending.isPending) {
      syncPending.mutate();
    }
  }, [isOnline, identity]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <AppFooter />
      <ProfileSetupDialog />
    </div>
  );
}
