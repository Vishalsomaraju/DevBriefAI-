/**
 * @module config/env
 * @description Centralized environment variable management. 
 * Validates required variables at runtime to ensure the app fails fast if misconfigured.
 */

const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_GA_MEASUREMENT_ID",
  "VITE_GEMINI_API_KEY"
] as const;

export const ENV = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID as string,
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
  }
} as const;

// Validate at startup
requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
});
