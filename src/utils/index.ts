/**
 * @module utils
 * @description Pure functions for formatting, parsing, and sanitizing.
 */

import { APP_CONFIG } from '@/constants';
import DOMPurify from 'dompurify';

export const formatDate = (timestamp: number): string => {
  if (isNaN(timestamp) || timestamp < 0) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
};

export const truncateInput = (input: string, maxLength: number = APP_CONFIG.maxCodeContextLength): string => {
  if (!input) return '';
  return input.length > maxLength ? input.substring(0, maxLength) : input;
};

export const parseGitHubUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'github.com' || parsedUrl.hostname === 'raw.githubusercontent.com') {
      return parsedUrl.pathname;
    }
    return null;
  } catch {
    return null;
  }
};

export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
