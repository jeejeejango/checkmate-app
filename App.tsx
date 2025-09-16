
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;
