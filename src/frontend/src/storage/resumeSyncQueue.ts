interface SyncOperation {
  type: 'create' | 'update' | 'delete' | 'rename' | 'duplicate';
  resumeId: string;
  data?: any;
  timestamp: number;
}

const QUEUE_KEY = 'resumeBuilder_syncQueue';
const LAST_SYNC_KEY = 'resumeBuilder_lastSync';

export function addToSyncQueue(operation: Omit<SyncOperation, 'timestamp'>): void {
  try {
    const queue = getSyncQueue();
    queue.push({ ...operation, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
  }
}

export function getSyncQueue(): SyncOperation[] {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading sync queue:', error);
    return [];
  }
}

export function clearSyncQueue(): void {
  try {
    localStorage.removeItem(QUEUE_KEY);
    updateLastSyncTime();
  } catch (error) {
    console.error('Error clearing sync queue:', error);
  }
}

export function updateLastSyncTime(): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last sync time:', error);
  }
}

export function getLastSyncTime(): number | null {
  try {
    const data = localStorage.getItem(LAST_SYNC_KEY);
    return data ? parseInt(data, 10) : null;
  } catch (error) {
    console.error('Error reading last sync time:', error);
    return null;
  }
}
