import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 py-20 px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Find your new <span className="text-indigo-600">best friend.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          FetchIt connects loving families with pets in need. Browse our available dogs and find the perfect companion today.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/pets"
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Browse Pets
          </Link>
          <Link 
            to="/dashboard"
            className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold shadow-sm hover:bg-gray-50 transition-all"
          >
            List a Pet
          </Link>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4 mb-20">
        <StatCard number="150+" label="Happy Adoptions" />
        <StatCard number="45" label="Dogs Available" />
        <StatCard number="100%" label="Love Guaranteed" />
      </section>
    </div>
  )
}
const StatCard = ({ number, label }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
    <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
    <div className="text-gray-500 font-medium">{label}</div>
  </div>
)

export default Home