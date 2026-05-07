/**
 * @module types
 * @description Centralized TypeScript definitions for the entire application.
 */

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface QAEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface Session {
  id: string;
  userId: string;
  title: string;
  codeContext: string;
  entries: QAEntry[];
  createdAt: number;
  updatedAt: number;
}

export interface GeminiResponse {
  text: string;
  isComplete: boolean;
}

export type ApiResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string };
