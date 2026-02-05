import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import ProfileSetupDialog from './ProfileSetupDialog';
import AndroidInstallPopup from './pwa/AndroidInstallPopup';
import { useSyncPendingChanges } from '../hooks/useResumes';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function AppLayout() {
  const isOnline = useOnlineStatus();
  const { identity } = useInternetIdentity();
  const syncPending = useSyncPendingChanges();

  useEffect(() => {
    if (isOnline && identity && !syncPending.isPending) {
      syncPending.mutate(undefined, {
        onSuccess: (result) => {
          if (result && result.success > 0) {
            toast.success(`Synced ${result.success} pending change${result.success > 1 ? 's' : ''}`);
          }
        },
        onError: (error) => {
          // Error message already includes details about partial success
          const message = error instanceof Error ? error.message : 'Sync failed';
          if (message.includes('partially completed')) {
            toast.warning(message);
          } else {
            toast.error('Failed to sync changes. Will retry when online.');
          }
        },
      });
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
      <AndroidInstallPopup />
    </div>
  );
}
