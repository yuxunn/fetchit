import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'

import DashboardLayout from './components/layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<ViewPets />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App