import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layouts/dashboard-layout';

import DogDirectory from './pages/dog-directory';
import DogDetails from './pages/dog-details';
import NewDog from './pages/dog-form';
import UploadFiles from './pages/upload-files';
import SignIn from './pages/SignIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <SignIn onSignIn={handleSignIn} />
      </Router>
    );
  }

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dogs" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dogs" element={<DogDirectory />} />
          <Route path="/dogs/new" element={<NewDog />} />
          <Route path="/dogs/:id/edit" element={<NewDog />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/upload-files" element={<UploadFiles />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App