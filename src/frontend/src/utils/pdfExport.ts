import type { Resume } from '../types/resume';

/**
 * Trigger browser print dialog for PDF export
 */
export function exportToPDF(resume: Resume) {
  try {
    // Validate resume has required content
    if (!resume) {
      throw new Error('No resume content available');
    }

    if (!resume.title || resume.title.trim() === '') {
      throw new Error('Resume must have a title');
    }

    // Generate a safe filename from the resume title
    const safeTitle = resume.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50); // Limit length
    const filename = `${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Set document title for better default PDF naming
    const originalTitle = document.title;
    document.title = filename;

    // Trigger print dialog
    window.print();

    // Restore original title after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error; // Re-throw so caller can handle
  }
}
