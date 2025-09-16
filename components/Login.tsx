import React from 'react';
// FIX: Removed unused import from 'firebase/auth' as we now use the compat API.
import { auth, googleProvider } from '../services/firebase';

const GoogleIcon: React.FC = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);


const Login: React.FC = () => {
  const handleSignIn = async () => {
    try {
      // FIX: Switched to Firebase v8 compat API method for signInWithPopup.
      await auth.signInWithPopup(googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      alert("Failed to sign in. Please check the console for more details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="text-center p-8 bg-secondary rounded-2xl shadow-2xl max-w-md w-full border border-border-color">
        <h1 className="text-5xl font-bold mb-2 text-text-primary">Checkmate AI</h1>
        <p className="text-lg text-text-secondary mb-8">Your intelligent to-do list.</p>
        <button
          onClick={handleSignIn}
          className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-text-primary bg-accent rounded-lg shadow-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-secondary transition-colors duration-200"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;