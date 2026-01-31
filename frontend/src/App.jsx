import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layouts/dashboard-layout';

import DogDirectory from './pages/dog-directory';
import DogDetails from './pages/dog-details';
import UploadFiles from './pages/upload-files';
import SignIn from './pages/SignIn';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

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
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dog-directory" element={<DogDirectory />} />
          <Route path="/dog-details" element={<DogDetails />} />
          <Route path="/upload-files" element={<UploadFiles />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App