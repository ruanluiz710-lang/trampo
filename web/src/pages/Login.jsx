import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const s = {
  page: { width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: 'Inter, system-ui, sans-serif' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)' },
  left: {
    backgroundColor: '#1C1C1C', padding: '80px 64px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  leftBg: {
    position: 'absolute', inset: 0, opacity: 0.07, pointerEvents: 'none',
    background: 'radial-gradient(circle at 20% 50%, #D85A30 0%, transparent 60%), radial-gradient(circle at 80% 20%, #FF7A52 0%, transparent 50%)',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'rgba(216,90,48,0.18)', color: '#FF7A52',
    fontSize: '13px', fontWeight: '600', padding: '8px 16px',
    borderRadius: '999px', marginBottom: '36px', width: 'fit-content',
  },
  leftTitle: { color: '#fff', fontWeight: '900', fontSize: '2.6rem', lineHeight: '1.15', marginBottom: '20px' },
  leftSub: { color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.7', marginBottom: '56px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  featureIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    backgroundColor: 'rgba(216,90,48,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', flexShrink: 0,
  },
  right: {
    padding: '80px 64px', display: 'flex',
    flexDirection: 'column', justifyContent: 'center', backgroundColor: '#F5F5F5',
  },
  formTitle: { fontWeight: '900', fontSize: '2rem', color: '#1C1C1C', marginBottom: '8px' },
  formSub: { color: '#9ca3af', fontSize: '15px', marginBottom: '36px' },
  card: { backgroundColor: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px', letterSpacing: '0.02em' },
  hint: { fontSize: '12px', color: '#9ca3af', marginTop: '6px', marginBottom: '20px' },
  input: {
    width: '100%', border: '2px solid #f0f0f0', borderRadius: '12px',
    padding: '14px 16px', fontSize: '15px', outline: 'none',
    fontFamily: 'inherit', color: '#1C1C1C', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btnPrimary: {
    width: '100%', backgroundColor: '#D85A30', color: '#fff',
    fontWeight: '800', fontSize: '16px', padding: '16px',
    borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', marginTop: '8px',
  },
  error: {
    backgroundColor: '#fef2f2', border: '1.5px solid #fecaca',
    color: '#dc2626', fontSize: '14px', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '20px',
  },
  pending: {
    backgroundColor: '#fffbeb', border: '1.5px solid #fde68a',
    color: '#92400e', fontSize: '14px', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '20px',
  },
}

export default function Login() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('error')
  const { login } = useAuth()
  const navigate = useNavigate()

  function focusInput(e) { e.target.style.borderColor = '#D85A30' }
  function blurInput(e) { e.target.style.borderColor = '#f0f0f0' }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) { setError('Preencha seu nome e telefone'); setErrorType('error'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone }),
      })
      const data = await res.json()

      if (res.status === 403) {
        setError(data.error)
        setErrorType('pending')
        setLoading(false)
        return
      }
      if (!res.ok) {
        setError(data.error || 'Erro ao entrar. Tente novamente.')
        setErrorType('error')
        setLoading(false)
        return
      }

      login(data.professional)
      navigate('/')
    } catch {
      setError('Erro de conexão. Verifique se a API está rodando.')
      setErrorType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.layout}>

        {/* Esquerda */}
        <div style={s.left}>
          <div style={s.leftBg} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={s.badge}><span>⚡</span> Para quem faz acontecer</div>
            <h2 style={s.leftTitle}>
              Sua próxima<br />
              oportunidade<br />
              <span style={{ color: '#D85A30' }}>começa aqui</span>
            </h2>
            <p style={s.leftSub}>
              Entre com seu nome e telefone<br />
              cadastrados para acessar seu perfil.
            </p>
            {[
              { icon: '👤', text: 'Perfil visível para milhares de clientes' },
              { icon: '📲', text: 'Receba contatos direto pelo WhatsApp' },
              { icon: '⭐', text: 'Construa sua reputação com avaliações' },
              { icon: '🆓', text: 'Totalmente gratuito para começar' },
            ].map((f, i) => (
              <div key={i} style={s.featureItem}>
                <div style={s.featureIcon}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', fontWeight: '500' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direita */}
        <div style={s.right}>
          <h1 style={s.formTitle}>Bem-vindo de volta</h1>
          <p style={s.formSub}>Entre com os dados que você usou no cadastro</p>

          <div style={s.card}>
            {error && (
              <div style={errorType === 'pending' ? s.pending : s.error}>
                {errorType === 'pending' ? '⏳' : '⚠️'} {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={s.label}>Seu nome completo</label>
              <input
                type="text"
                placeholder="Como você se cadastrou"
                value={name}
                onChange={e => setName(e.target.value)}
                style={s.input}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={s.hint}>Digite o nome exato que você usou no cadastro</p>

              <label style={s.label}>Telefone / WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                style={s.input}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <p style={s.hint}>O mesmo número cadastrado no seu perfil</p>

              <button
                type="submit"
                disabled={loading}
                style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#FF7A52')}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#D85A30')}
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>
            Ainda não tem conta?{' '}
            <Link to="/cadastro" style={{ color: '#D85A30', fontWeight: '700', textDecoration: 'none' }}>
              Criar perfil grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
