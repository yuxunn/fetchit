import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [dogs, setDogs] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDogs() {
      // Fetch all columns from the 'dogs' table
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
      
      if (error) {
        setError(error.message)
      } else {
        setDogs(data)
      }
    }
    fetchDogs()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🐶 FetchIt: Available Dogs</h1>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {dogs.length === 0 && !error ? (
        <p>Loading dogs (or no dogs found)...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {dogs.map((dog) => (
            <li key={dog.id} style={{ 
              border: '1px solid #ccc', 
              margin: '10px 0', 
              padding: '10px',
              borderRadius: '8px' 
            }}>
              <h3>{dog.name}</h3>
              <p>Breed: {dog.breed || 'Unknown'}</p>
              <p>Status: {dog.status || 'Available'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App