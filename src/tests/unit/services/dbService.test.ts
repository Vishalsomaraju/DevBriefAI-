import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dbService } from '@/services/dbService';
import { Session } from '@/types';

// Firebase mocks are in setup.ts — doc, setDoc, getDoc, etc. are already mocked

const mockSession: Session = {
  id: 'sess-1',
  userId: 'user-1',
  title: 'Test Session',
  codeContext: 'const x = 1;',
  entries: [],
  createdAt: 1000,
  updatedAt: 2000,
};

// Re-mock firestore operations to have return values per-test
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => ({})),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => mockSession })),
  getDocs: vi.fn(() => Promise.resolve({ forEach: (cb: any) => cb({ data: () => mockSession }) })),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  updateDoc: vi.fn(() => Promise.resolve()),
}));

vi.mock('@/config/firebase', () => ({ db: {} }));
vi.mock('@/constants', () => ({
  FIRESTORE_COLLECTIONS: { SESSIONS: 'sessions' },
  GA_EVENTS: {},
}));
vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackSessionSaved: vi.fn(),
    trackError: vi.fn(),
  }
}));

describe('dbService', () => {
  it('saveSession returns success', async () => {
    const result = await dbService.saveSession(mockSession);
    expect(result.error).toBeNull();
  });

  it('getUserSessions returns sessions', async () => {
    const result = await dbService.getUserSessions('user-1');
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('getSession returns a session when it exists', async () => {
    const result = await dbService.getSession('sess-1');
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });

  it('getSession returns null when doc does not exist', async () => {
    const { getDoc } = await import('firebase/firestore');
    (getDoc as any).mockResolvedValueOnce({ exists: () => false, data: () => null });
    const result = await dbService.getSession('missing');
    expect(result.data).toBeNull();
    expect(result.error).toBeNull();
  });

  it('saveSession handles errors', async () => {
    const { setDoc } = await import('firebase/firestore');
    (setDoc as any).mockRejectedValueOnce(new Error('Firestore write failed'));
    const result = await dbService.saveSession(mockSession);
    expect(result.error).toBe('Firestore write failed');
  });

  it('updateSession returns success', async () => {
    const result = await dbService.updateSession('sess-1', { title: 'Updated' });
    expect(result.error).toBeNull();
  });

  it('getUserSessions handles errors', async () => {
    const { getDocs } = await import('firebase/firestore');
    (getDocs as any).mockRejectedValueOnce(new Error('Query failed'));
    const result = await dbService.getUserSessions('user-1');
    expect(result.error).toBe('Query failed');
  });
});
