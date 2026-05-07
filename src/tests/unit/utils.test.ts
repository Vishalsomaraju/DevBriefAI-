import { describe, it, expect } from 'vitest';
import { formatDate, truncateInput, parseGitHubUrl, sanitizeInput } from '@/utils';
import { APP_CONFIG } from '@/constants';

describe('Unit Tests: Utils', () => {
  // formatDate (3 tests)
  it('formats valid timestamp correctly', () => {
    const timestamp = 1704067200000;
    const result = formatDate(timestamp);
    expect(result).toMatch(/Jan 1, 2024/);
  });
  it('handles zero timestamp', () => {
    expect(formatDate(0)).toBeDefined();
  });
  it('handles negative or invalid timestamp', () => {
    expect(formatDate(-1000)).toBe('Invalid Date');
    expect(formatDate(NaN)).toBe('Invalid Date');
  });

  // truncateInput (3 tests)
  it('does not truncate short input', () => {
    expect(truncateInput('hello', 10)).toBe('hello');
  });
  it('truncates exact length input', () => {
    expect(truncateInput('hello', 5)).toBe('hello');
  });
  it('truncates long input to maxLength', () => {
    expect(truncateInput('hello world', 5)).toBe('hello');
  });

  // parseGitHubUrl (3 tests)
  it('parses valid github url', () => {
    expect(parseGitHubUrl('https://github.com/user/repo')).toBe('/user/repo');
  });
  it('returns null for non-github url', () => {
    expect(parseGitHubUrl('https://google.com')).toBeNull();
  });
  it('returns null for invalid url string', () => {
    expect(parseGitHubUrl('not-a-url')).toBeNull();
  });

  // sanitizeInput (1 test)
  it('sanitizes malicious script tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello');
    expect(result).toBe('Hello');
  });
});
