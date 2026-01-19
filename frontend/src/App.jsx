import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ViewPets from './pages/ViewPets'
import PetDetails from './pages/PetDetails'

function Navbar() {
  const location = useLocation();
  const linkClass = (path) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path 
      ? 'bg-indigo-100 text-indigo-700' 
      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg">🐶</span>
            FetchIt
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/pets" className={linkClass('/pets')}>Browse Pets</Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<ViewPets />} />
            <Route path="/pets/:id" element={<PetDetails />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App