import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useIsMobile } from '../hooks/useIsMobile'

function Stars({ rating }) {
  return (
    <span style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#D85A30' : '#e5e7eb', fontSize: '18px' }}>★</span>
      ))}
    </span>
  )
}

export default function Profile() {
  const { id } = useParams()
  const isMobile = useIsMobile()
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ client_name: '', rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/professionals/${id}`)
      .then(r => r.json())
      .then(data => { setProfessional(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function submitReview(e) {
    e.preventDefault()
    if (!reviewForm.client_name.trim()) return
    setReviewLoading(true)
    setReviewError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      })
      if (!res.ok) {
        const err = await res.json()
        setReviewError(err.error || 'Erro ao enviar avaliação')
        return
      }
      setReviewSuccess(true)
      const updated = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/professionals/${id}`)
      setProfessional(await updated.json())
    } finally {
      setReviewLoading(false)
    }
  }

  const style = { fontFamily: "'Plus Jakarta Sans', sans-serif" }

  if (loading) return (
    <div style={{ ...style, width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Navbar />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 32px' }}>
        {[200, 120, 180].map((h, i) => (
          <div key={i} style={{ backgroundColor: '#fff', borderRadius: '20px', height: `${h}px`, marginBottom: '16px', opacity: 0.5 }} />
        ))}
      </div>
    </div>
  )

  if (!professional || professional.error) return (
    <div style={{ ...style, width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <p style={{ fontSize: '56px', marginBottom: '16px' }}>😕</p>
        <h2 style={{ fontWeight: '900', fontSize: '1.8rem', color: '#1C1C1C', marginBottom: '12px' }}>Profissional não encontrado</h2>
        <Link to="/profissionais" style={{ color: '#D85A30', fontWeight: '600', textDecoration: 'none' }}>← Voltar para a busca</Link>
      </div>
    </div>
  )

  const avgRating = professional.reviews?.length
    ? (professional.reviews.reduce((a, r) => a + r.rating, 0) / professional.reviews.length).toFixed(1)
    : null

  const whatsappNumber = professional.phone?.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=Olá ${professional.name}, vi seu perfil no Trampo e gostaria de solicitar um serviço.`

  const ContactCard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p style={{ fontWeight: '700', fontSize: '13px', color: '#9ca3af', marginBottom: '16px', letterSpacing: '0.05em' }}>CONTATO</p>
        <a
          href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#25D366', color: '#fff', fontWeight: '800', fontSize: '16px', padding: '16px', borderRadius: '14px', textDecoration: 'none', marginBottom: '10px' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '22px', height: '22px' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Falar pelo WhatsApp
        </a>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          Fale diretamente com {professional.name.split(' ')[0]}
        </p>
      </div>

      <div style={{ backgroundColor: '#FAECE7', borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontWeight: '700', fontSize: '13px', color: '#D85A30', marginBottom: '8px' }}>📍 Localização</p>
        <p style={{ fontWeight: '800', color: '#1C1C1C', fontSize: '15px', margin: 0 }}>{professional.city}</p>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: '2px 0 0' }}>{professional.state}</p>
      </div>
    </div>
  )

  return (
    <div style={{ ...style, width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Navbar />

      {/* Header escuro */}
      <div style={{ backgroundColor: '#1C1C1C', padding: isMobile ? '76px 16px 60px' : '48px 32px 80px', width: '100%' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link to="/profissionais" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
            ← Voltar para a busca
          </Link>
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '20px', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: isMobile ? '76px' : '100px', height: isMobile ? '76px' : '100px', borderRadius: '20px', backgroundColor: '#FAECE7', border: '4px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {professional.photo_url
                ? <img src={professional.photo_url} alt={professional.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#D85A30', fontWeight: '900', fontSize: isMobile ? '28px' : '36px' }}>{professional.name?.[0]}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ color: '#fff', fontWeight: '900', fontSize: isMobile ? '1.4rem' : '2rem', margin: 0 }}>{professional.name}</h1>
                {professional.professional_services?.[0]?.categories?.name && (
                  <span style={{ backgroundColor: '#D85A30', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    {professional.professional_services[0].categories.name}
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>📍 {professional.city}, {professional.state}</p>
              {avgRating && isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <span style={{ color: '#D85A30', fontSize: '16px' }}>★</span>
                  <span style={{ color: '#fff', fontWeight: '900', fontSize: '16px' }}>{avgRating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>({professional.reviews.length})</span>
                </div>
              )}
            </div>
            {avgRating && !isMobile && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ color: '#fff', fontWeight: '900', fontSize: '2.4rem', margin: 0, lineHeight: 1 }}>{avgRating}</p>
                <p style={{ color: '#D85A30', fontSize: '20px', margin: '2px 0 0' }}>★★★★★</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '4px 0 0' }}>{professional.reviews.length} avaliação(ões)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '-24px auto 0', padding: isMobile ? '0 16px 48px' : '0 32px 64px' }}>
        {isMobile ? (
          /* Layout mobile: contato primeiro, depois conteúdo */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ContactCard />

            {professional.bio && (
              <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1C1C1C', marginBottom: '10px' }}>Sobre</h2>
                <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '14px', margin: 0 }}>{professional.bio}</p>
              </div>
            )}

            {professional.professional_services?.length > 0 && (
              <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1C1C1C', marginBottom: '14px' }}>Serviços oferecidos</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {professional.professional_services.map((s, i) => (
                    <div key={i} style={{ backgroundColor: '#FAECE7', borderRadius: '12px', padding: '14px 16px' }}>
                      <p style={{ fontWeight: '700', color: '#D85A30', fontSize: '14px', margin: '0 0 4px' }}>{s.categories?.name}</p>
                      {s.description && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{s.description}</p>}
                      {s.price_range && <p style={{ fontWeight: '800', color: '#1C1C1C', fontSize: '13px', margin: '6px 0 0' }}>{s.price_range}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: '800', fontSize: '15px', color: '#1C1C1C', marginBottom: '16px' }}>
                Avaliações {professional.reviews?.length > 0 && <span style={{ color: '#9ca3af', fontWeight: '500' }}>({professional.reviews.length})</span>}
              </h2>
              {professional.reviews?.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>Nenhuma avaliação ainda. Seja o primeiro!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {professional.reviews?.map((r, i) => (
                    <div key={i} style={{ paddingBottom: '16px', borderBottom: i < professional.reviews.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '700', color: '#1C1C1C', fontSize: '14px' }}>{r.client_name}</span>
                        <Stars rating={r.rating} />
                      </div>
                      {r.comment && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f5f5f5' }}>
                <h3 style={{ fontWeight: '700', fontSize: '14px', color: '#1C1C1C', marginBottom: '14px' }}>Deixar avaliação</h3>
                {reviewSuccess ? (
                  <p style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>✅ Avaliação enviada! Obrigado.</p>
                ) : reviewError ? (
                  <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>⚠️ {reviewError}</p>
                ) : (
                  <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" placeholder="Seu nome" value={reviewForm.client_name}
                      onChange={e => setReviewForm(f => ({ ...f, client_name: e.target.value }))}
                      style={{ border: '2px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Nota:</span>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: n <= reviewForm.rating ? '#D85A30' : '#e5e7eb', padding: '0' }}>★</button>
                      ))}
                    </div>
                    <textarea placeholder="Conte como foi a experiência (opcional)" value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      rows={3} style={{ border: '2px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                    />
                    <button type="submit" disabled={reviewLoading} style={{ backgroundColor: '#1C1C1C', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: reviewLoading ? 0.7 : 1 }}>
                      {reviewLoading ? 'Enviando...' : 'Enviar avaliação'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Layout desktop: 2 colunas */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

            {/* Coluna principal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {professional.bio && (
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontWeight: '800', fontSize: '16px', color: '#1C1C1C', marginBottom: '12px' }}>Sobre</h2>
                  <p style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '15px', margin: 0 }}>{professional.bio}</p>
                </div>
              )}

              {professional.professional_services?.length > 0 && (
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontWeight: '800', fontSize: '16px', color: '#1C1C1C', marginBottom: '16px' }}>Serviços oferecidos</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {professional.professional_services.map((s, i) => (
                      <div key={i} style={{ backgroundColor: '#FAECE7', borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <p style={{ fontWeight: '700', color: '#D85A30', fontSize: '14px', margin: '0 0 4px' }}>{s.categories?.name}</p>
                          {s.description && <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{s.description}</p>}
                        </div>
                        {s.price_range && (
                          <span style={{ fontWeight: '800', color: '#1C1C1C', fontSize: '14px', whiteSpace: 'nowrap' }}>{s.price_range}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontWeight: '800', fontSize: '16px', color: '#1C1C1C', marginBottom: '20px' }}>
                  Avaliações {professional.reviews?.length > 0 && <span style={{ color: '#9ca3af', fontWeight: '500' }}>({professional.reviews.length})</span>}
                </h2>
                {professional.reviews?.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Nenhuma avaliação ainda. Seja o primeiro!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {professional.reviews?.map((r, i) => (
                      <div key={i} style={{ paddingBottom: '20px', borderBottom: i < professional.reviews.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#1C1C1C', fontSize: '14px' }}>{r.client_name}</span>
                          <Stars rating={r.rating} />
                        </div>
                        {r.comment && <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f5f5f5' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '14px', color: '#1C1C1C', marginBottom: '16px' }}>Deixar avaliação</h3>
                  {reviewSuccess ? (
                    <p style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>✅ Avaliação enviada! Obrigado.</p>
                  ) : reviewError ? (
                    <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>⚠️ {reviewError}</p>
                  ) : (
                    <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input type="text" placeholder="Seu nome" value={reviewForm.client_name}
                        onChange={e => setReviewForm(f => ({ ...f, client_name: e.target.value }))}
                        style={{ border: '2px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>Nota:</span>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: n <= reviewForm.rating ? '#D85A30' : '#e5e7eb', padding: '0' }}>★</button>
                        ))}
                      </div>
                      <textarea placeholder="Conte como foi a experiência (opcional)" value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        rows={3} style={{ border: '2px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                      />
                      <button type="submit" disabled={reviewLoading} style={{ backgroundColor: '#1C1C1C', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: reviewLoading ? 0.7 : 1 }}>
                        {reviewLoading ? 'Enviando...' : 'Enviar avaliação'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <ContactCard />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
