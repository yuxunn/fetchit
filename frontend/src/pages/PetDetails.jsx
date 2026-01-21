import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../supabaseClient'

const PetDetails = () => {
  const { id } = useParams()
  const [dog, setDog] = useState(null)
  const [vetBills, setVetBills] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchDogDetails() {
    setLoading(true)
    
    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', id)
      .single()

    const { data: billsData } = await supabase
      .from('vet_bills')
      .select('*')
      .eq('dog_id', id)
      .order('bill_date', { ascending: false })
    
    if (dogError) {
      console.error("Error fetching dog:", dogError)
    } else {
      setDog(dogData)
      setVetBills(billsData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDogDetails()
  }, [id])

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-pulse text-indigo-600 font-bold">Loading details...</div>
    </div>
  )

  if (!dog) return (
    <div className="text-center py-20 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-700">Dog not found</h2>
      <Link to="/pets" className="text-indigo-600 hover:underline mt-4 inline-block">← Return to Browse</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Link to="/pets" className="text-gray-500 hover:text-indigo-600 mb-6 inline-block font-medium transition-colors">
        ← Back to Pets
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="h-64 bg-indigo-50 flex items-center justify-center relative">
          <span className="text-8xl select-none">🐕</span>
          <div className="absolute bottom-4 right-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm border border-white/50 ${
               dog.status === 'Available' ? 'bg-green-100 text-green-800' : 
               dog.status === 'Adopted' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {dog.status}
            </span>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900">{dog.name}</h1>
            <p className="text-xl text-indigo-600 font-medium">{dog.breed}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <InfoBox label="Gender" value={dog.gender} />
            <InfoBox label="HDB Approved" value={dog.is_hdb_approved ? 'Yes ✅' : 'No ❌'} />
            <InfoBox label="Kennel" value={dog.kennel || 'Unassigned'} />
            <InfoBox label="Admitted" value={new Date(dog.created_at).toLocaleDateString()} />
          </div>

          <div className="prose max-w-none text-gray-600 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <p className="leading-relaxed">{dog.description || "No description provided yet for this dog."}</p>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
              Adopt {dog.name}
            </button>
             <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Sponsor
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          🏥 Medical History
        </h3>
        
        {vetBills.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {vetBills.map(bill => (
                  <tr key={bill.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {new Date(bill.bill_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium text-gray-900">
                      {bill.description}
                    </td>
                    <td className="p-3 text-sm font-bold text-gray-900 text-right">
                      ${bill.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <p className="text-gray-500 italic">No medical records found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const InfoBox = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
    <div className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">{label}</div>
    <div className="font-semibold text-gray-800">{value || '-'}</div>
  </div>
)

export default PetDetails