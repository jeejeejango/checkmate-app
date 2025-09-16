// FIX: Switched to Firebase v8 compat API to resolve module import errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// --- IMPORTANT SETUP INSTRUCTIONS ---
//
// Your Firebase configuration is now loaded from environment variables.
// You must create a `.env` file in the root of your project and add the
// following variables with your Firebase project's credentials.
//
// FIREBASE_API_KEY="your-api-key"
// FIREBASE_AUTH_DOMAIN="your-auth-domain"
// FIREBASE_PROJECT_ID="your-project-id"
// FIREBASE_STORAGE_BUCKET="your-storage-bucket"
// FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
// FIREBASE_APP_ID="your-app-id"
// FIREBASE_MEASUREMENT_ID="your-measurement-id"
//
// These variables are loaded automatically into `process.env`.
// To get these values, follow the setup guide in your Firebase project console.
//
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Simple check to see if config is missing
if (!firebaseConfig.apiKey) {
    const rootEl = document.getElementById('root');
    if(rootEl) {
        rootEl.innerHTML = `
            <div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background-color: #1a1a1a; color: #f0f0f0; padding: 2rem; font-family: sans-serif; z-index: 9999;">
                <div style="max-width: 600px; text-align: center; line-height: 1.6; border: 1px solid #3a3a3a; padding: 2rem; border-radius: 1rem; background-color: #2a2a2a;">
                    <h1 style="color: #ef4444; font-size: 1.875rem; margin-bottom: 1rem;">Firebase Configuration Missing</h1>
                    <p style="font-size: 1.125rem; margin-bottom: 0.75rem;">This application cannot start because it's missing Firebase credentials in the environment variables.</p>
                    <p>Please create a <code style="background: #3a3a3a; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">.env</code> file in your project root and add your Firebase project's configuration, as described in the comments within <code style="background: #3a3a3a; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">services/firebase.ts</code>.</p>
                    <p style="margin-top: 1rem; font-size: 0.875rem; color: #a0a0a0;">After setting up the config, you must also enable Google Sign-In in your Firebase project's Authentication settings.</p>
                </div>
            </div>
        `;
    }
    // Throw an error to stop further script execution.
    throw new Error("Firebase configuration is missing from environment variables. Please check services/firebase.ts for instructions.");
}

// Initialize Firebase
// FIX: Switched to Firebase v8 compat API to resolve module import errors.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, db, googleProvider };