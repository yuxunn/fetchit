import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import Dashboard from './pages/dashboard';
import DashboardLayout from './components/layouts/dashboard-layout';

import DogDirectory from './pages/dog-directory';
import DogDetails from './pages/dog-details';
import NewDog from './pages/dog-form';
import UploadFiles from './pages/upload-files';
import ArchivedDogs from './pages/ArchivedDogs';
import Users from './pages/Users';
import VetBills from './pages/VetBills';
import Sponsorships from './pages/sponsorships';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

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
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Check if this is a password recovery event
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
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

  // If user is in password recovery mode, show reset password page
  if (isPasswordRecovery) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<SignIn onSignIn={handleSignIn} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dogs" element={<DogDirectory />} />
          <Route path="/dogs/new" element={<NewDog />} />
          <Route path="/dogs/:id/edit" element={<NewDog />} />
          <Route path="/dogs/:id" element={<DogDetails />} />
          <Route path="/upload-files" element={<UploadFiles />} />
          <Route path="/archived-dogs" element={<ArchivedDogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/vet-bills" element={<VetBills />} />
          <Route path="/sponsorships" element={<Sponsorships />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App