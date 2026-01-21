import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import supabase from '../supabaseClient'

const ViewPets = () => {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterHDB, setFilterHDB] = useState(false)
  const [filterGender, setFilterGender] = useState('All')

  useEffect(() => {
    fetchDogs()
  }, [searchQuery, filterHDB, filterGender])

  async function fetchDogs() {
    setLoading(true)
    
    let query = supabase
      .from('dogs')
      .select('*')
      .order('id', { ascending: false })
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }
    if (filterHDB) {
      query = query.eq('is_hdb_approved', true)
    }

    if (filterGender !== 'All') {
      query = query.eq('gender', filterGender)
    }

    const { data, error } = await query

    if (!error) setDogs(data)
    setLoading(false)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Your <span className="text-indigo-600">Best Friend</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Browse our lovable dogs looking for their forever homes.
        </p>
      </div>

      <div className="sticky top-20 z-40 flex justify-center mb-12">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-xl border border-gray-200 flex flex-col md:flex-row items-center gap-2 w-full max-w-3xl">
          <div className="flex items-center px-6 py-3 bg-gray-50 rounded-full flex-1 w-full md:w-auto transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
            <span className="text-gray-400 mr-3 text-xl">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="bg-transparent border-none outline-none text-gray-700 w-full placeholder-gray-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-8 w-px bg-gray-300 hidden md:block mx-2"></div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end px-2">
            <select 
              className="px-4 py-2 bg-transparent text-gray-600 font-semibold outline-none cursor-pointer hover:text-indigo-600 transition-colors"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="All">Any Gender</option>
              <option value="Male">Male ♂</option>
              <option value="Female">Female ♀</option>
            </select>

            <button 
              onClick={() => setFilterHDB(!filterHDB)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                filterHDB 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filterHDB ? '🏠 HDB Approved' : '🏠 HDB?'}
            </button>
          </div>
        </div>
      </div>
          {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dogs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-xl font-medium">No dogs found matching those filters.</p>
              <button 
                onClick={() => {setSearchQuery(''); setFilterHDB(false); setFilterGender('All')}}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            dogs.map((dog) => (
              <Link 
                key={dog.id} 
                to={`/pets/${dog.id}`}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">🐕</span>
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                      dog.status === 'Available' 
                        ? 'bg-white text-emerald-600' 
                        : 'bg-white/90 text-gray-500'
                    }`}>
                      {dog.status || 'Available'}
                    </span>
                  </div>

                  {dog.is_hdb_approved && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-1 shadow-sm">
                      🏠 HDB OK
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {dog.name}
                      </h2>
                      <p className="text-indigo-500 font-medium text-sm">{dog.breed}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-bold">
                       {dog.gender === 'Male' ? '♂' : dog.gender === 'Female' ? '♀' : '?'}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Added recently</span>
                    <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                      Meet {dog.name} →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ViewPets