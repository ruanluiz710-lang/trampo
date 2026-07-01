import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

const f = "'Plus Jakarta Sans', sans-serif"
const PRIMARY = '#E25822'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (email === 'admin@trampo.com' && password === '9627') {
      sessionStorage.setItem('trampo_admin', '1')
      onLogin()
    } else {
      setError('Email ou senha incorretos.')
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f, padding: '24px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: PRIMARY, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: '900', fontSize: '24px' }}>T</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: '900', fontSize: '24px', marginBottom: '6px', letterSpacing: '-0.02em' }}>Painel Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Acesso restrito</p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '14px', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@trampo.com" autoComplete="email"
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#fff', fontFamily: f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Senha</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••" autoComplete="current-password"
                style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#fff', fontFamily: f, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: PRIMARY, color: '#fff', fontWeight: '800', fontSize: '16px', padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontFamily: f, marginTop: '8px' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, iconBg, iconColor, badge, badgeColor, badgeBg, value, label }) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ padding: '8px', backgroundColor: iconBg, borderRadius: '10px' }}>
          <span className="material-icons-round" style={{ color: iconColor, fontSize: '20px' }}>{icon}</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '600', color: badgeColor, backgroundColor: badgeBg, padding: '3px 8px', borderRadius: '6px' }}>{badge}</span>
      </div>
      <p style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', lineHeight: 1, marginBottom: '4px' }}>{value}</p>
      <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('trampo_admin') === '1')
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [tab, setTab] = useState('pending')
  const isMobile = useIsMobile()

  useEffect(() => { if (authed) fetchData() }, [authed])

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  async function fetchData() {
    setLoading(true)
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/pending`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/professionals`).then(r => r.json()),
      ])
      const approvedList = Array.isArray(approvedRes) ? approvedRes : []
      setPending(Array.isArray(pendingRes) ? pendingRes : [])
      setApproved(approvedList)

      const allReviews = await Promise.all(
        approvedList.map(p =>
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${p.id}`)
            .then(r => r.json())
            .then(revs => Array.isArray(revs) ? revs.map(r => ({ ...r, professionalName: p.name })) : [])
            .catch(() => [])
        )
      )
      setReviews(allReviews.flat())
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id, action) {
    setActionLoading(id + action)
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/${id}/${action}`, { method: 'PATCH' })
    await fetchData()
    setActionLoading(null)
  }

  async function deleteReview(id) {
    if (!window.confirm('Excluir esta avaliação?')) return
    setDeleteLoading(id)
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reviews/${id}`, { method: 'DELETE' })
    await fetchData()
    setDeleteLoading(null)
  }

  const list = tab === 'pending' ? pending : approved
  const stars = n => [1,2,3,4,5].map(s => <span key={s} style={{ color: s <= n ? '#f59e0b' : '#e2e8f0', fontSize: '14px' }}>★</span>)

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: f }}>

      {/* Top Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: '#1A1A1A', borderBottom: '1px solid rgba(255,255,255,0.05)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 16px' : '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: PRIMARY, width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '16px' }}>T</div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.02em' }}>TRAMPO</span>
          </div>
          {!isMobile && (
            <>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>Painel Admin</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isMobile ? 'Site' : 'Ver site'}
            <span className="material-icons-round" style={{ fontSize: '14px' }}>open_in_new</span>
          </Link>
          <button onClick={() => { sessionStorage.removeItem('trampo_admin'); setAuthed(false) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontFamily: f }}>
            <span className="material-icons-round" style={{ fontSize: '16px' }}>logout</span>
            {!isMobile && 'Sair'}
          </button>
        </div>
      </nav>

      {/* Main — sem sidebar no mobile */}
      <main style={{ marginLeft: isMobile ? '0' : '0', paddingTop: '64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>Visão Geral</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Painel de controle do Trampo</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '10px' : '20px', marginBottom: '28px' }}>
            <StatCard icon="hourglass_empty" iconBg="#fef3c7" iconColor="#d97706" badge={isMobile ? 'Pendente' : 'Ação necessária'} badgeColor="#d97706" badgeBg="#fffbeb" value={pending.length} label={isMobile ? 'Pendentes' : 'Aguardando aprovação'} />
            <StatCard icon="verified_user" iconBg="#d1fae5" iconColor="#059669" badge={`${approved.length} ativos`} badgeColor="#059669" badgeBg="#ecfdf5" value={approved.length} label={isMobile ? 'Aprovados' : 'Profissionais ativos'} />
            <StatCard icon="people" iconBg="#e0e7ff" iconColor="#4f46e5" badge="Total" badgeColor="#4f46e5" badgeBg="#eef2ff" value={pending.length + approved.length} label={isMobile ? 'Total' : 'Total cadastrado'} />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#fff', borderRadius: '14px', padding: '5px', border: '1px solid #f1f5f9', marginBottom: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {[
              { key: 'pending', icon: 'hourglass_bottom', label: `Pendentes (${pending.length})`, iconColor: '#f59e0b' },
              { key: 'approved', icon: 'check_circle', label: `Aprovados (${approved.length})`, iconColor: '#10b981' },
              { key: 'reviews', icon: 'star', label: `Avaliações (${reviews.length})`, iconColor: '#f59e0b' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: isMobile ? '8px 12px' : '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: f, fontSize: isMobile ? '12px' : '13px', fontWeight: '700', backgroundColor: tab === t.key ? '#0f172a' : 'transparent', color: tab === t.key ? '#fff' : '#64748b', transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <span className="material-icons-round" style={{ fontSize: '15px', color: tab === t.key ? '#fff' : t.iconColor }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Avaliações */}
          {tab === 'reviews' && (
            loading ? (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '64px' }}>Carregando...</div>
            ) : reviews.length === 0 ? (
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px' }}>Nenhuma avaliação ainda</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: isMobile ? '16px' : '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{r.client_name}</span>
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '8px' }}>→ {r.professionalName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>{stars(r.rating)}</div>
                    </div>
                    {r.comment && <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{r.comment}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => deleteReview(r.id)} disabled={deleteLoading === r.id} style={{ backgroundColor: '#fff', color: '#ef4444', fontWeight: '700', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #fecaca', cursor: 'pointer', fontFamily: f, opacity: deleteLoading === r.id ? 0.6 : 1 }}>
                        {deleteLoading === r.id ? '...' : '🗑 Excluir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Lista profissionais */}
          {tab !== 'reviews' && (loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '10px', opacity: 0.4, height: '72px', border: '1px solid #f1f5f9' }} />
            ))
          ) : list.length === 0 ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '60px 24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '50%', marginBottom: '16px', fontSize: '40px' }}>🥳</div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Tudo em dia!</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Nenhum cadastro pendente para revisão.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {list.map(p => {
                const category = p.professional_services?.[0]?.categories?.name
                const isApprovedTab = tab === 'approved'
                return (
                  <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: isMobile ? '16px' : '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '12px' : '0' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: PRIMARY, fontWeight: '900', fontSize: '18px' }}>{p.name?.[0]}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                          <h3 style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px', margin: 0 }}>{p.name}</h3>
                          {category && (
                            <span style={{ backgroundColor: '#fff7ed', color: PRIMARY, fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>{category}</span>
                          )}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>📍 {p.city}, {p.state}{!isMobile && ` · 📱 ${p.phone}`}</p>
                        {isMobile && <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0 0' }}>📱 {p.phone}</p>}
                      </div>
                      {!isMobile && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                          <Link to={`/profissional/${p.id}`} target="_blank" style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>Ver ↗</Link>
                          {!isApprovedTab ? (
                            <>
                              <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ backgroundColor: '#fff', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>Rejeitar</button>
                              <button onClick={() => handleAction(p.id, 'approve')} disabled={!!actionLoading} style={{ backgroundColor: PRIMARY, color: '#fff', fontWeight: '700', fontSize: '13px', padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1, boxShadow: `0 4px 10px ${PRIMARY}30` }}>
                                {actionLoading === p.id + 'approve' ? '...' : 'Aprovar ✓'}
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ backgroundColor: '#fff', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>Desativar</button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ações mobile */}
                    {isMobile && (
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f8fafc', paddingTop: '12px' }}>
                        <Link to={`/profissional/${p.id}`} target="_blank" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px', fontWeight: '600', textDecoration: 'none', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>Ver ↗</Link>
                        {!isApprovedTab ? (
                          <>
                            <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ flex: 1, backgroundColor: '#fff', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>Rejeitar</button>
                            <button onClick={() => handleAction(p.id, 'approve')} disabled={!!actionLoading} style={{ flex: 2, backgroundColor: PRIMARY, color: '#fff', fontWeight: '700', fontSize: '13px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>
                              {actionLoading === p.id + 'approve' ? '...' : 'Aprovar ✓'}
                            </button>
                          </>
                        ) : (
                          <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ flex: 1, backgroundColor: '#fff', color: '#ef4444', fontWeight: '700', fontSize: '13px', padding: '10px', borderRadius: '10px', border: '1.5px solid #fecaca', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>Desativar</button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
