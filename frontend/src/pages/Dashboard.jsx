import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Dashboard = () => {
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')

  const addDog = async (e) => {
    e.preventDefault() // Stop page refresh
    
    const { error } = await supabase
      .from('dogs')
      .insert([{ name: name, breed: breed, status: 'Available' }])

    if (error) alert(error.message)
    else alert('Dog added successfully!')
  }

  return (
    <div>
      <h1>Admin Dashboard 🛠️</h1>
      <h3>Add a New Dog</h3>
      <form onSubmit={addDog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          placeholder="Dog Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Breed" 
          value={breed} 
          onChange={(e) => setBreed(e.target.value)} 
          required 
        />
        <button type="submit">Add Dog</button>
      </form>
    </div>
  )
}
export default Dashboard