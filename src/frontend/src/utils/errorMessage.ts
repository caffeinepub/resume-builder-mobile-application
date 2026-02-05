/**
 * Extracts a user-friendly error message from various error types
 * while preserving the full error for logging
 */
export function extractErrorMessage(error: unknown): { userMessage: string; fullError: unknown } {
  let userMessage = 'An unexpected error occurred';

  if (typeof error === 'string') {
    userMessage = error;
  } else if (error instanceof Error) {
    userMessage = error.message;
    
    // Check for common backend trap messages
    if (error.message.includes('Unauthorized')) {
      userMessage = 'You need to be logged in to perform this action';
    } else if (error.message.includes('already exists')) {
      userMessage = 'A resume with this ID already exists';
    } else if (error.message.includes('not found')) {
      userMessage = 'Resume not found';
    } else if (error.message.includes('Cannot sync')) {
      userMessage = 'Unable to sync while offline. Changes will sync when you reconnect.';
    } else if (error.message.includes('partially completed')) {
      // Keep the detailed partial sync message as-is
      userMessage = error.message;
    }
  } else if (error && typeof error === 'object') {
    // Handle objects with message property
    const errorObj = error as { message?: string; error?: string };
    if (errorObj.message) {
      userMessage = errorObj.message;
    } else if (errorObj.error) {
      userMessage = errorObj.error;
    }
  }

  return { userMessage, fullError: error };
}

/**
 * Checks if an error is related to storage being unavailable
 */
export function isStorageError(error: unknown): boolean {
  if (typeof error === 'string') {
    return error.toLowerCase().includes('storage') || 
           error.toLowerCase().includes('quota') ||
           error.toLowerCase().includes('private');
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes('storage') || 
           msg.includes('quota') || 
           msg.includes('private') ||
           error.name === 'QuotaExceededError';
  }
  return false;
}

/**
 * Gets a user-friendly message for storage errors
 */
export function getStorageErrorMessage(): string {
  return 'Local storage is unavailable. This may be due to private browsing mode, storage quota exceeded, or browser restrictions. Please try: (1) disabling private/incognito mode, (2) freeing up browser storage space, or (3) logging in to sync your resumes to the cloud.';
}
