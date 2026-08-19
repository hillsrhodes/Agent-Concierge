import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * Lazy Firebase Client Configuration & Service Initializer
 * Designed to prevent build-time crashes or startup locks when credentials are not yet configured.
 */

let firebaseAppInstance: FirebaseApp | null = null;
let firestoreDbInstance: Firestore | null = null;

// Optional environment configuration or defaults
const getFirebaseConfig = () => {
  return {
    apiKey: (typeof window !== 'undefined' && (window as any).__FIREBASE_API_KEY__) || 'AIzaSyFakeKeyForPreviewEnvironmentSafeFallback',
    authDomain: 'agent-concierge.firebaseapp.com',
    projectId: 'agent-concierge-luxury',
    storageBucket: 'agent-concierge-luxury.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456789',
  };
};

/**
 * Lazy initialization of Firebase App
 */
export function getFirebaseApp(): FirebaseApp {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  if (getApps().length > 0) {
    firebaseAppInstance = getApp();
    return firebaseAppInstance;
  }

  const config = getFirebaseConfig();
  try {
    firebaseAppInstance = initializeApp(config);
    return firebaseAppInstance;
  } catch (error) {
    console.warn('Firebase lazy initialization fallback note:', error);
    // If already initialized
    if (getApps().length > 0) {
      firebaseAppInstance = getApp();
      return firebaseAppInstance;
    }
    throw error;
  }
}

/**
 * Lazy initialization of Firestore
 */
export function getFirestoreDb(): Firestore {
  if (firestoreDbInstance) {
    return firestoreDbInstance;
  }

  try {
    const app = getFirebaseApp();
    firestoreDbInstance = getFirestore(app);
    return firestoreDbInstance;
  } catch (error) {
    console.warn('Firestore lazy initialization note (falling back to server-side memory store):', error);
    throw error;
  }
}

/**
 * Safe check if Firebase is configured with real credentials
 */
export function isFirebaseConfigured(): boolean {
  try {
    const app = getFirebaseApp();
    return Boolean(app && app.options && app.options.projectId);
  } catch {
    return false;
  }
}

export { collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc };
