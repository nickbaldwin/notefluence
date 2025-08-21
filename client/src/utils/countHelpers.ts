/**
 * Helper function to extract count from Supabase count objects
 * Supabase count queries return objects like { count: number } instead of just numbers
 * Sometimes they return arrays of count objects like [{ count: number }]
 */
export function extractCount(value: number | { count: number } | { count: number }[] | undefined | null): number {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return 0;
  }
  
  // Handle array of count objects (Supabase sometimes returns this)
  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (typeof firstItem === 'object' && firstItem !== null && 'count' in firstItem) {
      const countValue = (firstItem as { count: number }).count;
      return typeof countValue === 'number' ? countValue : 0;
    }
  }
  
  // Handle object with count property
  if (typeof value === 'object' && value !== null && 'count' in value) {
    const countValue = (value as { count: number }).count;
    return typeof countValue === 'number' ? countValue : 0;
  }
  
  // Handle direct number
  if (typeof value === 'number') {
    return value;
  }
  
  // Fallback
  console.warn('Unexpected value type for extractCount:', value, typeof value);
  return 0;
}
