import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useIsMobile } from '../hooks/useIsMobile'

const CATEGORY_ICONS = {
  zap: '⚡', hammer: '🔨', leaf: '🌿', shield: '🛡️',
  droplets: '🔧', paintbrush: '🖌️', wrench: '🔩',
  home: '🏠', key: '🔑', wind: '❄️',
}

export default function Professionals() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [professionals, setProfessionals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [cityInput, setCityInput] = useState(searchParams.get('city') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`)
      .then(r => r.json())
      .then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (selectedCategory) params.set('category_id', selectedCategory)

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/professionals?${params}`)
      .then(r => r.json())
      .then(data => { setProfessionals(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [city, selectedCategory])

  function handleSearch(e) {
    e.preventDefault()
    setCity(cityInput)
  }

  function clearFilters() {
    setCity('')
    setCityInput('')
    setSelectedCategory('')
  }

  const hasFilters = city || selectedCategory

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Header com busca */}
      <div style={{ backgroundColor: '#1C1C1C', padding: isMobile ? '84px 16px 48px' : '100px 32px 72px', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontWeight: '900', fontSize: isMobile ? '1.8rem' : '2.4rem', marginBottom: '6px' }}>
            Encontre um profissional
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '28px' }}>
            Profissionais verificados prontos para te atender
          </p>

          {/* Barra de busca */}
          <form onSubmit={handleSearch} style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '8px',
            maxWidth: '860px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}>
            <div style={{ flex: 1, minWidth: isMobile ? 'auto' : '200px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', borderBottom: isMobile ? '1px solid #f0f0f0' : 'none' }}>
              <span style={{ fontSize: '18px', opacity: 0.4 }}>📍</span>
              <input
                type="text"
                placeholder="Buscar por cidade..."
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '15px', color: '#1C1C1C', fontFamily: 'inherit',
                  padding: '14px 0', backgroundColor: 'transparent',
                }}
              />
            </div>
            {!isMobile && <div style={{ width: '1px', backgroundColor: '#f0f0f0', margin: '8px 0' }} />}
            <div style={{ minWidth: isMobile ? 'auto' : '220px', flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <span style={{ fontSize: '18px', opacity: 0.4, marginRight: '10px' }}>🔧</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
                  fontSize: '15px', color: selectedCategory ? '#1C1C1C' : '#9ca3af',
                  fontFamily: 'inherit', cursor: 'pointer', padding: '14px 0',
                }}
              >
                <option value="">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{
              backgroundColor: '#D85A30', color: '#fff',
              fontWeight: '700', fontSize: '15px',
              padding: '14px 28px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
              Buscar
            </button>
          </form>

          {/* Chips de categorias */}
          <div style={{
            display: 'flex', gap: '8px', marginTop: '20px',
            overflowX: 'auto', paddingBottom: isMobile ? '4px' : '0',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            {categories.slice(0, 7).map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === String(cat.id) ? '' : String(cat.id))}
                style={{
                  backgroundColor: selectedCategory === String(cat.id) ? '#D85A30' : 'rgba(255,255,255,0.1)',
                  color: selectedCategory === String(cat.id) ? '#fff' : 'rgba(255,255,255,0.65)',
                  border: 'none', borderRadius: '999px',
                  padding: '8px 16px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {CATEGORY_ICONS[cat.icon]} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 32px' }}>

        {/* Linha de status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {loading ? 'Buscando...' : `${professionals.length} profissional(is) encontrado(s)`}
            {city && <span style={{ color: '#D85A30', fontWeight: '600' }}> em {city}</span>}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} style={{
              backgroundColor: 'transparent', border: '1.5px solid #e5e7eb',
              color: '#6b7280', borderRadius: '8px', padding: '6px 14px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Grid de cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '12px' : '24px' }}>
            {[...Array(isMobile ? 4 : 8)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', opacity: 0.6 }}>
                <div style={{ height: '140px', backgroundColor: '#f3f4f6' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '40%', marginBottom: '8px' }} />
                  <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '70%', marginBottom: '6px' }} />
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : professionals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: isMobile ? '60px 16px' : '100px 24px', backgroundColor: '#fff', borderRadius: '24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1C1C1C', marginBottom: '10px' }}>
              Nenhum profissional encontrado
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>
              Tente mudar os filtros ou buscar em outra cidade
            </p>
            <button onClick={clearFilters} style={{
              backgroundColor: '#D85A30', color: '#fff',
              fontWeight: '700', padding: '12px 24px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px',
            }}>
              Ver todos os profissionais
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '12px' : '24px' }}>
            {professionals.map(p => {
              const category = p.professional_services?.[0]?.categories
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/profissional/${p.id}`)}
                  style={{
                    backgroundColor: '#fff', borderRadius: '20px',
                    overflow: 'hidden', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  {/* Foto */}
                  <div style={{ height: isMobile ? '120px' : '160px', backgroundColor: '#FAECE7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(216,90,48,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#D85A30', fontWeight: '900', fontSize: '24px' }}>{p.name?.[0]}</span>
                      </div>
                    )}
                    {category && (
                      <div style={{
                        position: 'absolute', top: '8px', left: '8px',
                        backgroundColor: '#1C1C1C', color: '#fff',
                        fontSize: '10px', fontWeight: '700',
                        padding: '3px 8px', borderRadius: '999px',
                        letterSpacing: '0.04em',
                      }}>
                        {category.name}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: isMobile ? '14px' : '20px' }}>
                    <h3 style={{ fontWeight: '800', color: '#1C1C1C', fontSize: isMobile ? '14px' : '17px', marginBottom: '3px' }}>
                      {p.name}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>
                      📍 {p.city}, {p.state}
                    </p>

                    {p.review_count > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>★</span>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>
                          {p.avg_rating.toFixed(1)} <span style={{ fontWeight: '400' }}>({p.review_count})</span>
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: '11px', color: '#d1d5db', marginBottom: '10px' }}>Sem avaliações</p>
                    )}

                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#FAECE7', color: '#D85A30',
                      fontSize: '12px', fontWeight: '700',
                      padding: '5px 12px', borderRadius: '8px',
                    }}>
                      Ver perfil →
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
