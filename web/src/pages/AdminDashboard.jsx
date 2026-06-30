import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
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
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ padding: '10px', backgroundColor: iconBg, borderRadius: '12px' }}>
          <span className="material-icons-round" style={{ color: iconColor, fontSize: '22px' }}>{icon}</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '600', color: badgeColor, backgroundColor: badgeBg, padding: '4px 10px', borderRadius: '6px' }}>{badge}</span>
      </div>
      <p style={{ fontSize: '40px', fontWeight: '900', color: '#0f172a', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
      <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{label}</p>
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

  useEffect(() => { if (authed) fetchData() }, [authed])

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  async function fetchData() {
    setLoading(true)
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/pending`)).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/professionals`)).then(r => r.json()),
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

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
  ]

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: f }}>

      {/* Top Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: '#1A1A1A', borderBottom: '1px solid rgba(255,255,255,0.05)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: PRIMARY, width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '16px' }}>T</div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.02em' }}>TRAMPO</span>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>Painel Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Ver site
            <span className="material-icons-round" style={{ fontSize: '14px' }}>open_in_new</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 12px 6px 6px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#fff' }}>AD</div>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>Administrador</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: '64px', bottom: 0, width: '240px', backgroundColor: '#fff', borderRight: '1px solid #f1f5f9', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: item.active ? `${PRIMARY}15` : 'transparent', color: item.active ? PRIMARY : '#94a3b8', fontWeight: item.active ? '700' : '500', fontSize: '14px', cursor: 'pointer' }}>
              <span className="material-icons-round" style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
          <button onClick={() => { sessionStorage.removeItem('trampo_admin'); setAuthed(false) }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', color: '#ef4444', fontWeight: '600', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', fontFamily: f, width: '100%' }}>
            <span className="material-icons-round" style={{ fontSize: '20px' }}>logout</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', paddingTop: '64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>Visão Geral</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Bem-vindo de volta ao painel de controle do Trampo.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            <StatCard icon="hourglass_empty" iconBg="#fef3c7" iconColor="#d97706" badge="Ação necessária" badgeColor="#d97706" badgeBg="#fffbeb" value={pending.length} label="Aguardando aprovação" />
            <StatCard icon="verified_user" iconBg="#d1fae5" iconColor="#059669" badge={`${approved.length} ativos`} badgeColor="#059669" badgeBg="#ecfdf5" value={approved.length} label="Profissionais ativos" />
            <StatCard icon="people" iconBg="#e0e7ff" iconColor="#4f46e5" badge="Base total" badgeColor="#4f46e5" badgeBg="#eef2ff" value={pending.length + approved.length} label="Total cadastrado" />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#fff', borderRadius: '14px', padding: '5px', border: '1px solid #f1f5f9', width: 'fit-content', marginBottom: '24px' }}>
            {[
              { key: 'pending', icon: 'hourglass_bottom', label: `Pendentes (${pending.length})`, iconColor: '#f59e0b' },
              { key: 'approved', icon: 'check_circle', label: `Aprovados (${approved.length})`, iconColor: '#10b981' },
              { key: 'reviews', icon: 'star', label: `Avaliações (${reviews.length})`, iconColor: '#f59e0b' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: f, fontSize: '13px', fontWeight: '700', backgroundColor: tab === t.key ? '#0f172a' : 'transparent', color: tab === t.key ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                <span className="material-icons-round" style={{ fontSize: '16px', color: tab === t.key ? '#fff' : t.iconColor }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Avaliações */}
          {tab === 'reviews' && (
            loading ? (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '64px' }}>Carregando...</div>
            ) : reviews.length === 0 ? (
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '80px 32px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <p style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px' }}>Nenhuma avaliação ainda</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{r.client_name}</span>
                        <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '10px' }}>→ {r.professionalName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>{stars(r.rating)}</div>
                    </div>
                    {r.comment && <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>{r.comment}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => deleteReview(r.id)} disabled={deleteLoading === r.id} style={{ backgroundColor: '#fff', color: '#ef4444', fontWeight: '700', fontSize: '13px', padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #fecaca', cursor: 'pointer', fontFamily: f, opacity: deleteLoading === r.id ? 0.6 : 1 }}>
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
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', marginBottom: '12px', opacity: 0.4, height: '88px', border: '1px solid #f1f5f9' }} />
            ))
          ) : list.length === 0 ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '80px 32px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '50%', marginBottom: '16px', fontSize: '48px' }}>🥳</div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Tudo em dia!</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Nenhum cadastro pendente para revisão.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {list.map(p => {
                const category = p.professional_services?.[0]?.categories?.name
                const isApprovedTab = tab === 'approved'
                return (
                  <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px 24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: PRIMARY, fontWeight: '900', fontSize: '20px' }}>{p.name?.[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px', margin: 0 }}>{p.name}</h3>
                        {category && (
                          <span style={{ backgroundColor: '#fff7ed', color: PRIMARY, fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '999px' }}>{category}</span>
                        )}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>📍 {p.city}, {p.state} &nbsp;·&nbsp; 📱 {p.phone}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                      <Link to={`/profissional/${p.id}`} target="_blank" style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                        Ver ↗
                      </Link>
                      {!isApprovedTab ? (
                        <>
                          <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ backgroundColor: '#fff', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>
                            Rejeitar
                          </button>
                          <button onClick={() => handleAction(p.id, 'approve')} disabled={!!actionLoading} style={{ backgroundColor: PRIMARY, color: '#fff', fontWeight: '700', fontSize: '13px', padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1, boxShadow: `0 4px 10px ${PRIMARY}30` }}>
                            {actionLoading === p.id + 'approve' ? '...' : 'Aprovar ✓'}
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleAction(p.id, 'reject')} disabled={!!actionLoading} style={{ backgroundColor: '#fff', color: '#94a3b8', fontWeight: '700', fontSize: '13px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', cursor: 'pointer', fontFamily: f, opacity: actionLoading ? 0.6 : 1 }}>
                          Desativar
                        </button>
                      )}
                    </div>
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
