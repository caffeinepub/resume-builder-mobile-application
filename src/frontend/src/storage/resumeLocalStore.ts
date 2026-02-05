import { Resume, DEFAULT_RESUME_CONTENT, DEFAULT_RESUME_FORMATTING } from '../types/resume';

const STORAGE_KEY = 'resumeBuilder_resumes';
const VERSION_KEY = 'resumeBuilder_version';
const CURRENT_VERSION = '1.0';

// In-memory fallback store when localStorage is unavailable
let memoryStore: Resume[] = [];
let storageAvailable: boolean | null = null;

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
    return true;
  } catch (e) {
    storageAvailable = false;
    console.warn('localStorage is not available, using in-memory fallback:', e);
    return false;
  }
}

export function getAllLocalResumes(): Resume[] {
  try {
    if (!isStorageAvailable()) {
      return [...memoryStore];
    }
    
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      migrateStorage();
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading local resumes:', error);
    // Return memory store as fallback
    return [...memoryStore];
  }
}

export function getLocalResume(id: string): Resume | null {
  const resumes = getAllLocalResumes();
  return resumes.find((r) => r.id === id) || null;
}

export function saveLocalResume(resume: Resume): void {
  try {
    const resumes = getAllLocalResumes();
    const index = resumes.findIndex((r) => r.id === resume.id);
    const updatedResume = { ...resume, updatedAt: Date.now() };
    
    if (index >= 0) {
      resumes[index] = updatedResume;
    } else {
      resumes.push(updatedResume);
    }
    
    if (isStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    }
    
    // Always update memory store as fallback
    memoryStore = resumes;
  } catch (error) {
    console.error('Error saving local resume:', error);
    
    // Try to save to memory store at least
    const resumes = [...memoryStore];
    const index = resumes.findIndex((r) => r.id === resume.id);
    const updatedResume = { ...resume, updatedAt: Date.now() };
    
    if (index >= 0) {
      resumes[index] = updatedResume;
    } else {
      resumes.push(updatedResume);
    }
    memoryStore = resumes;
    
    // Re-throw with more context
    throw new Error('Failed to save resume to local storage. Using temporary in-memory storage.');
  }
}

export function deleteLocalResume(id: string): void {
  try {
    const resumes = getAllLocalResumes();
    const filtered = resumes.filter((r) => r.id !== id);
    
    if (isStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    
    // Always update memory store
    memoryStore = filtered;
  } catch (error) {
    console.error('Error deleting local resume:', error);
    
    // Try memory store at least
    memoryStore = memoryStore.filter((r) => r.id !== id);
    throw error;
  }
}

export function createLocalResume(title: string): Resume {
  const now = Date.now();
  const resume: Resume = {
    id: `local_${now}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    content: DEFAULT_RESUME_CONTENT,
    formatting: DEFAULT_RESUME_FORMATTING,
    createdAt: now,
    updatedAt: now,
  };
  
  try {
    saveLocalResume(resume);
  } catch (error) {
    // Even if save fails, return the resume object
    // It will be in memory store
    console.warn('Resume created in memory only:', error);
  }
  
  return resume;
}

export function duplicateLocalResume(id: string): Resume | null {
  const original = getLocalResume(id);
  if (!original) return null;
  const now = Date.now();
  const duplicate: Resume = {
    ...original,
    id: `local_${now}_${Math.random().toString(36).substr(2, 9)}`,
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  
  try {
    saveLocalResume(duplicate);
  } catch (error) {
    console.warn('Duplicate created in memory only:', error);
  }
  
  return duplicate;
}

export function renameLocalResume(id: string, newTitle: string): void {
  const resume = getLocalResume(id);
  if (resume) {
    resume.title = newTitle;
    resume.updatedAt = Date.now();
    saveLocalResume(resume);
  }
}

function migrateStorage(): void {
  try {
    if (isStorageAvailable()) {
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch (error) {
    console.warn('Could not migrate storage:', error);
  }
}

/**
 * Check if storage is currently available
 */
export function checkStorageAvailability(): { available: boolean; usingMemory: boolean } {
  const available = isStorageAvailable();
  return {
    available,
    usingMemory: !available || memoryStore.length > 0,
  };
}
