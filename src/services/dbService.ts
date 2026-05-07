/**
 * @module services/db
 * @description Firestore database operations for DevBrief AI.
 */
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Session, ApiResponse } from "@/types";
import { FIRESTORE_COLLECTIONS } from "@/constants";
import { analyticsService } from "./analyticsService";
import { GA_EVENTS } from "@/constants";

export const dbService = {
  saveSession: async (session: Session): Promise<ApiResponse<void>> => {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SESSIONS, session.id);
      await setDoc(docRef, session);
      analyticsService.trackSessionSaved();
      return { data: undefined, error: null };
    } catch (error: any) {
      analyticsService.trackError("dbService.saveSession", error.message);
      return { data: null, error: error.message || "Failed to save session" };
    }
  },

  updateSession: async (sessionId: string, updates: Partial<Session>): Promise<ApiResponse<void>> => {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SESSIONS, sessionId);
      await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
      return { data: undefined, error: null };
    } catch (error: any) {
      analyticsService.trackError("dbService.updateSession", error.message);
      return { data: null, error: error.message || "Failed to update session" };
    }
  },

  getUserSessions: async (userId: string): Promise<ApiResponse<Session[]>> => {
    try {
      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.SESSIONS),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const sessions: Session[] = [];
      querySnapshot.forEach((doc) => {
        sessions.push(doc.data() as Session);
      });
      return { data: sessions, error: null };
    } catch (error: any) {
      analyticsService.trackError("dbService.getUserSessions", error.message);
      return { data: null, error: error.message || "Failed to fetch user sessions" };
    }
  },

  getSession: async (sessionId: string): Promise<ApiResponse<Session | null>> => {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SESSIONS, sessionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: docSnap.data() as Session, error: null };
      }
      return { data: null, error: null };
    } catch (error: any) {
      analyticsService.trackError("dbService.getSession", error.message);
      return { data: null, error: error.message || "Failed to fetch session" };
    }
  }
};
