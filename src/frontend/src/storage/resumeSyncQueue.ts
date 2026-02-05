interface SyncOperation {
  type: 'create' | 'update' | 'delete' | 'rename' | 'duplicate';
  resumeId: string;
  data?: any;
  timestamp: number;
}

const QUEUE_KEY = 'resumeBuilder_syncQueue';
const LAST_SYNC_KEY = 'resumeBuilder_lastSync';
const QUEUE_CHANGE_EVENT = 'resumeSyncQueueChanged';

export function addToSyncQueue(operation: Omit<SyncOperation, 'timestamp'>): void {
  try {
    const queue = getSyncQueue();
    queue.push({ ...operation, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    notifyQueueChange();
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
    notifyQueueChange();
  } catch (error) {
    console.error('Error clearing sync queue:', error);
  }
}

/**
 * Remove specific operations from the queue (for partial success handling)
 */
export function removeFromSyncQueue(indicesToRemove: number[]): void {
  try {
    const queue = getSyncQueue();
    const updatedQueue = queue.filter((_, index) => !indicesToRemove.includes(index));
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    
    // Update last sync time only if queue is now empty
    if (updatedQueue.length === 0) {
      updateLastSyncTime();
    }
    
    notifyQueueChange();
  } catch (error) {
    console.error('Error removing from sync queue:', error);
  }
}

export function updateLastSyncTime(): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    notifyQueueChange();
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

/**
 * Notify listeners that the sync queue has changed
 */
function notifyQueueChange(): void {
  window.dispatchEvent(new CustomEvent(QUEUE_CHANGE_EVENT));
}

/**
 * Listen for sync queue changes
 */
export function onSyncQueueChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(QUEUE_CHANGE_EVENT, handler);
  return () => window.removeEventListener(QUEUE_CHANGE_EVENT, handler);
}
