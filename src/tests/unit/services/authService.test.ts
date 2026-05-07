import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/authService';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signInWithGoogle calls signInWithPopup', async () => {
    (signInWithPopup as any).mockResolvedValueOnce({ user: { uid: '123' } });
    const response = await authService.signInWithGoogle();
    expect(signInWithPopup).toHaveBeenCalled();
    expect(response.data?.uid).toBe('123');
  });

  it('signInWithGoogle handles errors', async () => {
    (signInWithPopup as any).mockRejectedValueOnce(new Error('Auth failed'));
    const response = await authService.signInWithGoogle();
    expect(response.error).toBe('Failed to sign in with Google');
  });

  it('signOutUser calls signOut', async () => {
    (signOut as any).mockResolvedValueOnce(undefined);
    const response = await authService.signOutUser();
    expect(signOut).toHaveBeenCalled();
    expect(response.error).toBeNull();
  });

  it('onAuthStateChange registers callback', () => {
    const callback = vi.fn();
    (onAuthStateChanged as any).mockImplementation((auth: any, cb: any) => {
      cb({ uid: '456' });
      return vi.fn(); // unsubscribe mock
    });
    
    const unsub = authService.onAuthStateChange(callback);
    expect(onAuthStateChanged).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith({ uid: '456' });
    expect(typeof unsub).toBe('function');
  });
});
