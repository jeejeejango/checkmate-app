import React from 'react';
// FIX: Removed unused import from 'firebase/auth' as we now use the compat API.
import { auth } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      // FIX: Switched to Firebase v8 compat API method for signOut.
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-secondary border-b border-border-color shadow-lg">
      <h1 className="text-2xl font-bold text-text-primary">Checkmate AI</h1>
      <div className="flex items-center space-x-4">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User Avatar'}
            className="w-10 h-10 rounded-full"
          />
        )}
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;