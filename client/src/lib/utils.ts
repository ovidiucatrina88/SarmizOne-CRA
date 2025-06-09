import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values consistently throughout the application
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a percentage value
 * @param value The decimal value (e.g., 0.25 for 25%)
 * @param decimals Number of decimal places to include (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 2) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Get a color class based on severity level
 * @param severity The severity level
 * @returns CSS class name for appropriate color
 */
export function getSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

/**
 * Format a date for display
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string) {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Truncate a string to a maximum length
 * @param str The string to truncate
 * @param maxLength Maximum allowed length
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Safely access nested object properties
 * @param obj The object to access
 * @param path The property path (e.g. 'user.address.street')
 * @param defaultValue Value to return if path doesn't exist
 * @returns The value at path or defaultValue if not found
 */
export function get(obj: any, path: string, defaultValue: any = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,.]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param value Value to check
 * @returns Boolean indicating if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Sort an array of objects by a specific property
 * @param arr Array to sort
 * @param key Property to sort by
 * @param order Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByProperty<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  if (!Array.isArray(arr)) return [];
  
  return [...arr].sort((a, b) => {
    if (a[key] === b[key]) return 0;
    
    if (a[key] === null || a[key] === undefined) return order === 'asc' ? -1 : 1;
    if (b[key] === null || b[key] === undefined) return order === 'asc' ? 1 : -1;
    
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return order === 'asc'
        ? a[key].localeCompare(b[key] as string)
        : b[key].localeCompare(a[key] as string);
    }
    
    return order === 'asc'
      ? (a[key] as any) - (b[key] as any)
      : (b[key] as any) - (a[key] as any);
  });
}

/**
 * Group an array of objects by a specific property
 * @param arr Array to group
 * @param key Property to group by
 * @returns Object with groups
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  if (!Array.isArray(arr)) return {};
  
  return arr.reduce((result, item) => {
    const groupKey = String(item[key] || 'undefined');
    return {
      ...result,
      [groupKey]: [...(result[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}

/**
 * Convert a number to an ordinal string (1st, 2nd, 3rd, etc.)
 * @param n Number to convert
 * @returns Ordinal string
 */
export function toOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Calculate the average of an array of numbers
 * @param numbers Array of numbers
 * @returns The average value
 */
export function average(numbers: number[]): number {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Create a delay promise
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random hex color
 * @returns Hex color string
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Generate an array of specified length with a range of numbers
 * @param start Starting number
 * @param end Ending number
 * @returns Array of numbers
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}