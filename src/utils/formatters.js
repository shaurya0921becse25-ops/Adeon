/**
 * Formatting utilities for WanderWise
 */

/**
 * Format Indian Currency (e.g. ₹20,000, ₹1,00,000)
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Math.round(Number(amount));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Format month/year (e.g. "October 2024")
 */
export function formatMonthYear(monthStr) {
  if (!monthStr) return '';
  const date = new Date(monthStr);
  if (isNaN(date.getTime())) return monthStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Format relative date (e.g. "3 months ago", "1 year ago")
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  if (diffInMonths <= 0) return 'This month';
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const years = Math.floor(diffInMonths / 12);
  const rem = diffInMonths % 12;
  return years === 1 ? (rem > 0 ? `1 yr ${rem} mo ago` : '1 year ago') : `${years} years ago`;
}

/**
 * Check review freshness
 * - "Recent" if under 6 months
 * - "Check before relying on this" if over 18 months
 */
export function getFreshnessLabel(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  if (diffInMonths < 6) {
    return { label: 'Recent', type: 'recent' };
  }
  if (diffInMonths >= 18) {
    return { label: 'Check before relying on this', type: 'stale' };
  }
  return null;
}
