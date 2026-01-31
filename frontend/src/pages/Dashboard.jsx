import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import supabase from '../supabaseClient'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDogs: 0,
    availableDogs: 0,
    adoptedDogs: 0,
    totalVetBills: 0,
    inventoryCount: 0
  })
  const [dogs, setDogs] = useState([])
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDog, setNewDog] = useState({ name: '', breed: '', gender: 'Male' })

  async function fetchDashboardData() {
    setLoading(true)
    
    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: billData } = await supabase.from('vet_bills').select('amount')
    
    const { data: merchData } = await supabase.from('merchandise').select('*')

    if (!dogError && dogData) {
      const total = dogData.length
      const available = dogData.filter(d => d.status === 'Available').length
      const adopted = dogData.filter(d => d.status === 'Adopted').length
      const totalBills = billData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
      const totalStock = merchData?.reduce((sum, item) => sum + (item.stock_quantity || 0), 0) || 0

      const statusCounts = [
        { name: 'Available', value: available, color: '#10B981' }, // Green
        { name: 'Adopted', value: adopted, color: '#6366F1' },     // Indigo
        { name: 'Pending', value: total - available - adopted, color: '#F59E0B' } // Amber
      ].filter(item => item.value > 0)

      setStats({
        totalDogs: total,
        availableDogs: available,
        adoptedDogs: adopted,
        totalVetBills: totalBills,
        inventoryCount: totalStock
      })
      setDogs(dogData)
      setStatusData(statusCounts)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleAddDog = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('dogs').insert([{ ...newDog, status: 'Available' }])
    if (!error) {
      alert('Dog added!')
      setShowAddForm(false)
      fetchDashboardData() 
      setNewDog({ name: '', breed: '', gender: 'Male' })
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shelter Overview</h1>
          <p className="text-gray-500">Welcome back, Admin.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {showAddForm ? 'Close Form' : '+ Add New Dog'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Dogs" 
          value={stats.totalDogs} 
          icon="🐕" 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Adoption Rate" 
          value={`${stats.totalDogs ? Math.round((stats.adoptedDogs / stats.totalDogs) * 100) : 0}%`} 
          subtext={`${stats.adoptedDogs} adopted total`}
          icon="🏠" 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Vet Expenses" 
          value={`$${stats.totalVetBills.toLocaleString()}`} 
          icon="🏥" 
          color="bg-red-50 text-red-600" 
        />
        <StatCard 
          title="Merch Stock" 
          value={stats.inventoryCount} 
          icon="📦" 
          color="bg-purple-50 text-purple-600" 
        />
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-8 animate-fade-in-down">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Register New Intake</h3>
          <form onSubmit={handleAddDog} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              placeholder="Name" 
              className="border p-2 rounded-lg"
              value={newDog.name} 
              onChange={e => setNewDog({...newDog, name: e.target.value})}
              required
            />
            <input 
              placeholder="Breed" 
              className="border p-2 rounded-lg"
              value={newDog.breed} 
              onChange={e => setNewDog({...newDog, breed: e.target.value})}
              required
            />
            <select 
              className="border p-2 rounded-lg bg-white"
              value={newDog.gender}
              onChange={e => setNewDog({...newDog, gender: e.target.value})}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded-lg md:col-span-3 hover:bg-green-700">
              Save Record
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Dog Status</h3>
          <div className="h-64">
            {stats.totalDogs === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Intakes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Breed</th>
                  <th className="pb-3 font-medium">Date Added</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {dogs.slice(0, 5).map((dog) => (
                  <tr key={dog.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-semibold text-gray-800">{dog.name}</td>
                    <td className="py-3 text-gray-600">{dog.breed}</td>
                    <td className="py-3 text-gray-500 text-sm">
                      {new Date(dog.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        dog.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        dog.status === 'Adopted' ? 'bg-indigo-100 text-indigo-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {dog.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {dogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">No dogs in database</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
)

export default Dashboard