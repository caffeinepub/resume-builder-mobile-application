/**
 * Generate a unique ID for list items in resume sections
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
