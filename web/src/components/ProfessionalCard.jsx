import { Link } from 'react-router-dom'

export default function ProfessionalCard({ professional }) {
  const { id, name, city, state, photo_url, professional_services } = professional
  const category = professional_services?.[0]?.categories?.name || 'Profissional'

  return (
    <Link
      to={`/profissional/${id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="h-44 bg-[#FAECE7] flex items-center justify-center overflow-hidden">
        {photo_url ? (
          <img src={photo_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#D85A30]/20 flex items-center justify-center">
            <span className="text-[#D85A30] text-3xl font-bold">{name?.[0]}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-[#D85A30] uppercase tracking-wider">
          {category}
        </span>
        <h3 className="font-bold text-[#1C1C1C] text-lg mt-1 group-hover:text-[#D85A30] transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          📍 {city}, {state}
        </p>
      </div>
    </Link>
  )
}
