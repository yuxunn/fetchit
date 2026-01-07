import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' // <--- Needed for the button!
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const ViewPets = () => {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDogs()
  }, [])

  async function fetchDogs() {
    const { data, error } = await supabase.from('dogs').select('*').order('id', { ascending: false })
    if (!error) setDogs(data)
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Pets 🐶</h1>
      <p className="text-gray-500 mb-8">Click on a pet to learn more about them.</p>
      
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.map((dog) => (
            <div key={dog.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col">
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">🐕</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{dog.name}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    dog.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {dog.status || 'Available'}
                  </span>
                </div>
                <p className="text-indigo-600 font-medium mb-4">{dog.breed}</p>
                
                {/* The "View Details" Button */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <Link 
                    to={`/pets/${dog.id}`} 
                    className="block w-full text-center bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-semibold py-2 rounded-lg transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewPets