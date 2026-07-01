import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useIsMobile } from '../hooks/useIsMobile'

const CATEGORY_CONFIG = {
  'Ar-condicionado': { icon: 'ac_unit',     bg: '#eff6ff', color: '#3b82f6' },
  'Chaveiro':        { icon: 'key',          bg: '#fefce8', color: '#ca8a04' },
  'Diarista':        { icon: 'home',         bg: '#fef2f2', color: '#ef4444' },
  'Eletricista':     { icon: 'bolt',         bg: '#fefce8', color: '#eab308' },
  'Encanador':       { icon: 'build',        bg: '#f3f4f6', color: '#4b5563' },
  'Jardineiro':      { icon: 'forest',       bg: '#f0fdf4', color: '#22c55e' },
  'Marceneiro':      { icon: 'handyman',     bg: '#fffbeb', color: '#92400e' },
  'Pedreiro':        { icon: 'construction', bg: '#f3f4f6', color: '#374151' },
  'Pintor':          { icon: 'brush',        bg: '#fff7ed', color: '#D95D39' },
  'Segurança':       { icon: 'shield',       bg: '#fef2f2', color: '#dc2626' },
}

const f = "'Plus Jakarta Sans', sans-serif"

export default function Home() {
  const [categories, setCategories] = useState([])
  const [city, setCity] = useState('')
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`).then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.set('city', city.trim())
    navigate(`/profissionais?${params.toString()}`)
  }

  function goToCategory(id) {
    navigate(`/profissionais?category_id=${id}`)
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', fontFamily: f, backgroundColor: '#F9FAFB' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        position: 'relative',
        paddingTop: isMobile ? '90px' : '160px',
        paddingBottom: isMobile ? '60px' : '120px',
        backgroundColor: '#1A1A1A', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '25%', right: '-80px', width: '384px', height: '384px', backgroundColor: 'rgba(217,93,57,0.18)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '-80px', width: '384px', height: '384px', backgroundColor: 'rgba(217,93,57,0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', marginBottom: '20px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D95D39', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            100% brasileiro — feito pra quem trabalha
          </span>

          <h1 style={{ fontSize: isMobile ? '2rem' : 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: '900', color: '#ffffff', lineHeight: '1.15', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Encontre o profissional<br />
            <em style={{ color: '#D95D39', fontStyle: 'italic' }}>certo pra você</em>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? '15px' : '18px', fontWeight: '500', maxWidth: '540px', margin: isMobile ? '0 auto 36px' : '0 auto 52px', lineHeight: '1.7' }}>
            Eletricistas, pedreiros, jardineiros e muito mais.<br />
            Direto ao ponto, sem enrolação.
          </p>

          <form onSubmit={handleSearch} style={{
            maxWidth: '820px', margin: '0 auto',
            backgroundColor: '#fff', borderRadius: isMobile ? '14px' : '20px',
            padding: isMobile ? '6px' : '8px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'row',
            alignItems: 'center',
          }}>
            {!isMobile && (
              <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', padding: '12px 20px', borderRight: '1px solid #f0f0f0' }}>
                <span className="material-symbols-outlined" style={{ color: '#9ca3af', marginRight: '10px', fontSize: '22px' }}>search</span>
                <input
                  type="text" placeholder="Qual serviço você precisa?"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#1A1A1A', fontFamily: f, backgroundColor: 'transparent' }}
                />
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: isMobile ? '6px 12px' : '12px 20px' }}>
              <span className="material-symbols-outlined" style={{ color: '#9ca3af', marginRight: '8px', fontSize: isMobile ? '18px' : '22px' }}>location_on</span>
              <input
                type="text" placeholder={isMobile ? 'Buscar por cidade...' : 'Sua cidade'} value={city}
                onChange={e => setCity(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1A1A1A', fontFamily: f, backgroundColor: 'transparent' }}
              />
            </div>
            <button type="submit" style={{
              backgroundColor: '#D95D39', color: '#fff', fontWeight: '700', fontSize: isMobile ? '13px' : '15px',
              padding: isMobile ? '10px 16px' : '16px 32px',
              borderRadius: isMobile ? '10px' : '14px', border: 'none', cursor: 'pointer', fontFamily: f,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              margin: '2px', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              Buscar
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{ padding: isMobile ? '56px 16px' : '96px 32px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: '#111827', marginBottom: '10px', letterSpacing: '-0.02em' }}>
            O que você precisa?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: isMobile ? '32px' : '56px', fontWeight: '500' }}>
            Escolha uma categoria para ver os profissionais disponíveis
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '16px',
            maxWidth: isMobile ? '100%' : '800px',
            margin: '0 auto',
          }}>
            {['Eletricista', 'Pedreiro', 'Ar-condicionado'].map(name => categories.find(c => c.name === name)).filter(Boolean).map(cat => {
              const cfg = CATEGORY_CONFIG[cat.name] || { icon: 'build', bg: '#f3f4f6', color: '#6b7280' }
              return (
                <button key={cat.id} onClick={() => goToCategory(cat.id)}
                  style={{ backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '20px', padding: isMobile ? '24px 12px' : '32px 20px', cursor: 'pointer', fontFamily: f, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(217,93,57,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ width: isMobile ? '52px' : '64px', height: isMobile ? '52px' : '64px', backgroundColor: cfg.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '26px' : '30px', color: cfg.color }}>{cfg.icon}</span>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: isMobile ? '13px' : '14px', color: '#374151' }}>{cat.name}</span>
                </button>
              )
            })}
            <button onClick={() => navigate('/profissionais')}
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #1A1A1A', borderRadius: '20px', padding: isMobile ? '24px 12px' : '32px 20px', cursor: 'pointer', fontFamily: f, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: isMobile ? '52px' : '64px', height: isMobile ? '52px' : '64px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '26px' : '30px', color: '#fff' }}>grid_view</span>
              </div>
              <span style={{ fontWeight: '700', fontSize: isMobile ? '13px' : '14px', color: '#fff' }}>Outros</span>
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: isMobile ? '56px 16px' : '96px 32px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: '#111827', marginBottom: '10px', letterSpacing: '-0.02em' }}>Como funciona</h2>
          <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: isMobile ? '40px' : '64px', fontWeight: '500' }}>Simples, rápido e sem complicação</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '36px' : '48px' }}>
            {[
              { n: '01', title: 'Escolha o serviço', desc: 'Selecione a categoria ou busque pelo nome do serviço que você precisa.' },
              { n: '02', title: 'Veja os profissionais', desc: 'Confira perfis verificados, avaliações e especialidades de cada um.' },
              { n: '03', title: 'Entre em contato', desc: 'Fale direto com o profissional pelo WhatsApp e combine tudo na hora.' },
            ].map(step => (
              <div key={step.n}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(217,93,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '18px', fontWeight: '800', color: '#D95D39' }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.7' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', padding: isMobile ? '64px 16px' : '96px 32px', backgroundColor: '#D95D39', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', color: '#fff', marginBottom: '14px', letterSpacing: '-0.02em' }}>É profissional?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '15px' : '18px', marginBottom: '36px', fontWeight: '500', lineHeight: '1.6' }}>
            Cadastre seu perfil e comece a receber clientes por apenas R$&nbsp;14,90 — pagamento único.
          </p>
          <Link to="/cadastro" style={{ display: 'inline-block', backgroundColor: '#1A1A1A', color: '#fff', fontWeight: '800', fontSize: isMobile ? '15px' : '17px', padding: isMobile ? '16px 36px' : '18px 48px', borderRadius: '16px', textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            Criar meu perfil
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1A1A1A', padding: isMobile ? '48px 16px' : '64px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <img src="/logotrampo.png" alt="Trampo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
            <span style={{ color: '#fff', fontWeight: '900', fontSize: '20px', letterSpacing: '-0.02em' }}>TRAMPO</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', marginBottom: '40px' }}>Para quem faz acontecer</p>
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Termos', 'Privacidade', 'Contato'].map(item => (
                <a key={item} href="#" style={{ color: '#6b7280', fontSize: '12px', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item}</a>
              ))}
            </div>
            <p style={{ color: '#4b5563', fontSize: '12px' }}>© 2025 TRAMPO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
