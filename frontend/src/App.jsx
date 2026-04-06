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
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dogs" element={<DashboardLayout><DogDirectory /></DashboardLayout>} />
        <Route path="/dogs/new" element={<DashboardLayout><NewDog /></DashboardLayout>} />
        <Route path="/dogs/:id/edit" element={<DashboardLayout><NewDog /></DashboardLayout>} />
        <Route path="/dogs/:id" element={<DashboardLayout><DogDetails /></DashboardLayout>} />
        <Route path="/upload-files" element={<DashboardLayout><UploadFiles /></DashboardLayout>} />
        <Route path="/archived-dogs" element={<DashboardLayout><ArchivedDogs /></DashboardLayout>} />
        <Route path="/users" element={<DashboardLayout><Users /></DashboardLayout>} />
        <Route path="/vet-bills" element={<DashboardLayout><VetBills /></DashboardLayout>} />
        <Route path="/sponsorships" element={<DashboardLayout><Sponsorships /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App