import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import Home from './pages/Home';
import ViewPets from './pages/ViewPets';
import PetDetails from './pages/PetDetails';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layouts/dashboard-layout';

import DogDirectory from './pages/dog-directory';
import DogDetails from './pages/dog-details';
import UploadFiles from './pages/upload-files';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<ViewPets />} />
          <Route path="/pets/:id" element={<PetDetails />} />
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