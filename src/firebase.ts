import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsy8O75PR9iIY5rmEAsjUHGW9C7Wgydkk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lofty-composite-sgtt6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lofty-composite-sgtt6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lofty-composite-sgtt6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "601555217793",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:601555217793:web:e80900be24e1a3e8c74c80",
};

export const databaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  "ai-studio-fluxplatformplug-fa3b54d6-9082-4ac6-8ce4-d706e5897c6d";

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, databaseId);

// Test connection as required by skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or initializing.");
    }
  }
}
testConnection();
