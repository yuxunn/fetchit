import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ViewPets from './pages/ViewPets'

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif' }}>
        {/* Navigation Bar (The "Tabs") */}
        <nav style={{ padding: '20px', background: '#f0f0f0', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/pets" style={{ marginRight: '15px' }}>View Pets</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        {/* Page Content */}
        <div style={{ padding: '0 20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<ViewPets />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App