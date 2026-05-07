/**
 * @module services/authService
 * @description Handles Firebase Authentication operations including Google Sign-In, Sign-Out, and Auth State listening.
 */

import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { UserProfile, ApiResponse } from '@/types';
import { analyticsService } from './analyticsService';

class AuthService {
  private provider = new GoogleAuthProvider();

  /**
   * Signs in a user using the Google OAuth popup.
   * @returns {Promise<ApiResponse<UserProfile>>} Structured API response containing the user profile or an error message.
   */
  public async signInWithGoogle(): Promise<ApiResponse<UserProfile>> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      const user = result.user;
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      analyticsService.trackSessionStarted();
      return { data: userProfile, error: null };
    } catch (error) {
      console.error('[AuthService] Google Sign-In Failed:', error);
      analyticsService.trackError('auth', error instanceof Error ? error.message : 'Unknown auth error');
      return { data: null, error: 'Failed to sign in with Google' };
    }
  }

  /**
   * Signs out the currently authenticated user.
   * @returns {Promise<ApiResponse<void>>} Structured API response indicating success or failure.
   */
  public async signOutUser(): Promise<ApiResponse<void>> {
    try {
      await signOut(auth);
      return { data: undefined, error: null };
    } catch (error) {
      console.error('[AuthService] Sign-Out Failed:', error);
      analyticsService.trackError('auth', error instanceof Error ? error.message : 'Unknown sign-out error');
      return { data: null, error: 'Failed to sign out' };
    }
  }

  /**
   * Subscribes to authentication state changes.
   * @param {(user: User | null) => void} callback - Function executed whenever the user's auth state changes.
   * @returns {() => void} Unsubscribe function to clean up the listener.
   */
  public onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback, (error) => {
      console.error('[AuthService] Auth State Change Error:', error);
      analyticsService.trackError('auth', error.message);
    });
  }
}

export const authService = new AuthService();
