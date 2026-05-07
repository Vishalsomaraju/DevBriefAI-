import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionService } from '@/services/sessionService';
import { setDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { Session } from '@/types';
import { analyticsService } from '@/services/analyticsService';

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackSessionSaved: vi.fn(),
    trackError: vi.fn(),
  }
}));

describe('SessionService', () => {
  const mockSession: Session = {
    id: 's1',
    userId: 'u1',
    title: 'Test',
    codeContext: '',
    entries: [],
    createdAt: 123,
    updatedAt: 123
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saveSession saves document and tracks event', async () => {
    (setDoc as any).mockResolvedValueOnce(undefined);
    const response = await sessionService.saveSession(mockSession);
    expect(setDoc).toHaveBeenCalled();
    expect(analyticsService.trackSessionSaved).toHaveBeenCalled();
    expect(response.error).toBeNull();
  });

  it('getUserSessions fetches user sessions', async () => {
    (getDocs as any).mockResolvedValueOnce({
      docs: [{ data: () => mockSession }]
    });
    const response = await sessionService.getUserSessions('u1');
    expect(getDocs).toHaveBeenCalled();
    expect(response.data).toEqual([mockSession]);
  });

  it('getSessionById returns session if exists', async () => {
    (getDoc as any).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockSession
    });
    const response = await sessionService.getSessionById('s1');
    expect(getDoc).toHaveBeenCalled();
    expect(response.data).toEqual(mockSession);
  });

  it('deleteSession deletes document', async () => {
    (deleteDoc as any).mockResolvedValueOnce(undefined);
    const response = await sessionService.deleteSession('s1');
    expect(deleteDoc).toHaveBeenCalled();
    expect(response.error).toBeNull();
  });
});
