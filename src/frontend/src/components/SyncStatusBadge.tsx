import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getLastSyncTime, getSyncQueue, onSyncQueueChange } from '../storage/resumeSyncQueue';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudOff, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

export default function SyncStatusBadge() {
  const { identity } = useInternetIdentity();
  const isOnline = useOnlineStatus();
  const isAuthenticated = !!identity;

  // Local state to track sync queue changes
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSync, setLastSync] = useState<number | null>(null);

  // Update state when sync queue changes
  useEffect(() => {
    const updateState = () => {
      setPendingCount(getSyncQueue().length);
      setLastSync(getLastSyncTime());
    };

    // Initial update
    updateState();

    // Listen for changes
    const unsubscribe = onSyncQueueChange(updateState);

    return unsubscribe;
  }, []);

  if (!isAuthenticated) return null;

  const getTimeAgo = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={isOnline ? 'default' : 'secondary'} className="gap-1.5 cursor-help">
            {isOnline ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p className="font-medium">{isOnline ? 'Connected' : 'Offline Mode'}</p>
            {isOnline && (
              <>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last sync: {getTimeAgo(lastSync)}
                </p>
                {pendingCount > 0 && <p className="text-amber-500">{pendingCount} pending changes</p>}
              </>
            )}
            {!isOnline && <p className="text-muted-foreground">Changes will sync when online</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
