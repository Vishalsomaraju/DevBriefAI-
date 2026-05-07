/**
 * @module services/sessionService
 * @description Handles Firestore CRUD operations for user sessions.
 */

import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { FIRESTORE_COLLECTIONS } from '@/constants';
import { Session, ApiResponse } from '@/types';
import { analyticsService } from './analyticsService';

class SessionService {
  /**
   * Helper to get the Firestore sessions collection reference.
   * @private
   */
  private getCollectionRef() {
    return collection(db, FIRESTORE_COLLECTIONS.SESSIONS);
  }

  /**
   * Saves or updates a session in Firestore.
   * @param {Session} session - The session object to save.
   * @returns {Promise<ApiResponse<void>>} Structured API response indicating success or failure.
   */
  public async saveSession(session: Session): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(this.getCollectionRef(), session.id);
      await setDoc(docRef, session, { merge: true });
      
      analyticsService.trackSessionSaved();
      return { data: undefined, error: null };
    } catch (error) {
      console.error('[SessionService] Save Session Failed:', error);
      analyticsService.trackError('firestore', error instanceof Error ? error.message : 'Unknown save error');
      return { data: null, error: 'Failed to save session' };
    }
  }

  /**
   * Retrieves all sessions for a specific user, ordered by most recently updated.
   * @param {string} userId - The user's unique identifier.
   * @returns {Promise<ApiResponse<Session[]>>} Structured API response with the list of sessions or an error.
   */
  public async getUserSessions(userId: string): Promise<ApiResponse<Session[]>> {
    try {
      const q = query(
        this.getCollectionRef(),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map(doc => doc.data() as Session);
      
      return { data: sessions, error: null };
    } catch (error) {
      console.error('[SessionService] Get User Sessions Failed:', error);
      analyticsService.trackError('firestore', error instanceof Error ? error.message : 'Unknown fetch error');
      return { data: null, error: 'Failed to retrieve sessions' };
    }
  }

  /**
   * Retrieves a specific session by its document ID.
   * @param {string} sessionId - The session's unique identifier.
   * @returns {Promise<ApiResponse<Session | null>>} Structured API response with the session data, null if not found, or an error.
   */
  public async getSessionById(sessionId: string): Promise<ApiResponse<Session | null>> {
    try {
      const docRef = doc(this.getCollectionRef(), sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: docSnap.data() as Session, error: null };
      }
      return { data: null, error: null };
    } catch (error) {
      console.error('[SessionService] Get Session Failed:', error);
      analyticsService.trackError('firestore', error instanceof Error ? error.message : 'Unknown fetch error');
      return { data: null, error: 'Failed to retrieve session' };
    }
  }

  /**
   * Deletes a session from Firestore.
   * Note: The current firestore.rules prevent delete operations, meaning this might require updated rules or act as a soft delete placeholder.
   * @param {string} sessionId - The session's unique identifier.
   * @returns {Promise<ApiResponse<void>>} Structured API response indicating success or failure.
   */
  public async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(this.getCollectionRef(), sessionId);
      await deleteDoc(docRef);
      return { data: undefined, error: null };
    } catch (error) {
      console.error('[SessionService] Delete Session Failed:', error);
      analyticsService.trackError('firestore', error instanceof Error ? error.message : 'Unknown delete error');
      return { data: null, error: 'Failed to delete session' };
    }
  }
}

export const sessionService = new SessionService();
