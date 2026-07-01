import { useState, useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const f = "'Plus Jakarta Sans', sans-serif"
const PRIMARY = '#D95D39'

export default function Register() {
  const [categories, setCategories] = useState([])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', city: '', state: '', bio: '', category_id: '', description: '', price_range: '' })
  const isMobile = useIsMobile()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`).then(r => r.json()).then(setCategories)
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  function formatPhone(value) {
    const d = value.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 2) return `(${d}`
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  }

  function nextStep(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Digite seu nome completo'); return }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Digite um telefone válido com DDD'); return }
    if (!form.city.trim()) { setError('Digite sua cidade'); return }
    if (!form.state) { setError('Selecione seu estado'); return }
    setError(''); setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function nextStep2(e) {
    e.preventDefault()
    if (!form.category_id) { setError('Selecione uma categoria'); return }
    setError(''); setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handlePay() {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/payment/create-preference`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.init_point
    } catch (err) {
      setError(err.message || 'Erro ao iniciar pagamento. Tente novamente.')
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', backgroundColor: '#F8FAFC', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', outline: 'none', fontFamily: f, color: '#1A1A1A', boxSizing: 'border-box', transition: 'border-color 0.2s' }
  const focus = e => e.target.style.borderColor = PRIMARY
  const blur  = e => e.target.style.borderColor = '#e2e8f0'

  const stepDone  = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: `${PRIMARY}18`, color: PRIMARY, padding: isMobile ? '10px 8px' : '12px 16px', borderRadius: '12px', fontWeight: '700', fontSize: isMobile ? '12px' : '14px' }
  const stepActive= { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: PRIMARY, color: '#fff', padding: isMobile ? '10px 8px' : '12px 16px', borderRadius: '12px', fontWeight: '700', fontSize: isMobile ? '12px' : '14px', boxShadow: `0 4px 14px ${PRIMARY}40` }
  const stepIdle  = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9ca3af', padding: isMobile ? '10px 8px' : '12px 16px', borderRadius: '12px', fontWeight: '700', fontSize: isMobile ? '12px' : '14px' }

  const StepNum = ({ n, done, active }) => (
    <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: done ? PRIMARY : active ? 'rgba(255,255,255,0.25)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: done || active ? '#fff' : '#9ca3af', flexShrink: 0 }}>
      {done ? '✓' : n}
    </span>
  )

  return (
    <div style={{ width: '100%', minHeight: '100vh', fontFamily: f, backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1A1A1A', padding: isMobile ? '0 16px' : '0 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logotrampo.png" alt="Trampo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
            <span style={{ color: '#fff', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.02em' }}>TRAMPO</span>
          </div>
          <a href="/profissionais" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            {isMobile ? 'Voltar' : 'Encontrar profissional'}
          </a>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingBottom: isMobile ? '40px' : '56px', paddingTop: isMobile ? '32px' : '48px' }}>
          <h1 style={{ color: '#fff', fontWeight: '900', fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 4vw, 3rem)', marginBottom: '10px', letterSpacing: '-0.02em' }}>Criar meu perfil</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>Cadastre-se e comece a receber clientes</p>
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: isMobile ? '0 16px 64px' : '0 24px 80px' }}>
        {/* Steps */}
        <div style={{ display: 'flex', gap: '6px', margin: '-22px 0 28px', backgroundColor: '#fff', borderRadius: '16px', padding: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={step > 1 ? stepDone : step === 1 ? stepActive : stepIdle}>
            <StepNum n="1" done={step > 1} active={step === 1} />
            {isMobile ? 'Dados' : 'Seus dados'}
          </div>
          <div style={step > 2 ? stepDone : step === 2 ? stepActive : stepIdle}>
            <StepNum n="2" done={step > 2} active={step === 2} />
            Serviço
          </div>
          <div style={step === 3 ? stepActive : stepIdle}>
            <StepNum n="3" done={false} active={step === 3} />
            {isMobile ? 'Pagar' : 'Pagamento'}
          </div>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: isMobile ? '24px 20px' : '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', fontSize: '14px', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>Informações de acesso</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>Nome e telefone serão usados para entrar na sua conta</p>

              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#ffedd5', borderRadius: '8px', padding: '5px', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ea580c' }}>lightbulb</span>
                </div>
                <p style={{ fontSize: '13px', color: '#9a3412', lineHeight: '1.6', margin: 0 }}>
                  Guarde seu <strong>nome completo e telefone</strong>. Eles serão sua única forma de entrar no Trampo.
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Nome completo <span style={{ color: PRIMARY }}>*</span></label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Seu nome completo" style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>WhatsApp <span style={{ color: PRIMARY }}>*</span></label>
                <input type="tel" value={form.phone} onChange={e => set('phone', formatPhone(e.target.value))} placeholder="(11) 99999-9999" style={inputStyle} onFocus={focus} onBlur={blur} />
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>Os clientes entram em contato por aqui</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Cidade <span style={{ color: PRIMARY }}>*</span></label>
                  <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Ex: São Paulo" style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Estado <span style={{ color: PRIMARY }}>*</span></label>
                  <select value={form.state} onChange={e => set('state', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                    <option value="">UF</option>
                    {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Sobre você <span style={{ color: '#9ca3af', fontWeight: '400' }}>(opcional)</span></label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Fale sobre sua experiência, anos de trabalho, diferenciais..." rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} onFocus={focus} onBlur={blur} />
              </div>

              <button type="submit" style={{ width: '100%', backgroundColor: PRIMARY, color: '#fff', fontWeight: '800', fontSize: '16px', padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Próximo
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={nextStep2}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>Seu serviço</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>O que você oferece aos clientes</p>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Categoria principal <span style={{ color: PRIMARY }}>*</span></label>
                <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                  <option value="">Selecione o tipo de serviço</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Descrição <span style={{ color: '#9ca3af', fontWeight: '400' }}>(opcional)</span></label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descreva o que você faz, experiência, certificados..." rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} onFocus={focus} onBlur={blur} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Faixa de preço <span style={{ color: '#9ca3af', fontWeight: '400' }}>(opcional)</span></label>
                <input type="text" value={form.price_range} onChange={e => set('price_range', e.target.value)} placeholder="Ex: R$ 150–400 por diária" style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, backgroundColor: '#fff', color: '#6b7280', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '12px', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                  Voltar
                </button>
                <button type="submit" style={{ flex: 2, backgroundColor: PRIMARY, color: '#fff', fontWeight: '800', fontSize: '15px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Próximo
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>Ativar perfil</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>Pague uma única vez para aparecer para os clientes</p>

              {/* Resumo */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Resumo do cadastro</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Nome', value: form.name },
                    { label: 'Telefone', value: form.phone },
                    { label: 'Cidade', value: `${form.city}, ${form.state}` },
                    { label: 'Serviço', value: categories.find(c => String(c.id) === String(form.category_id))?.name },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>{row.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valor */}
              <div style={{ backgroundColor: '#1A1A1A', borderRadius: '14px', padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', width: '80px', height: '80px', backgroundColor: 'rgba(217,93,57,0.2)', borderRadius: '50%', filter: 'blur(20px)' }} />
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '4px' }}>Valor único de ativação</p>
                  <p style={{ color: '#fff', fontWeight: '900', lineHeight: 1 }}>
                    <span style={{ fontSize: '18px' }}>R$ </span>
                    <span style={{ fontSize: isMobile ? '36px' : '42px' }}>14</span>
                    <span style={{ fontSize: '18px' }}>,90</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Aceito</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '700' }}>PIX</span>
                    <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '24px' }}>credit_card</span>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  'Perfil visível para clientes da sua cidade',
                  'Receba contatos direto no seu WhatsApp',
                  'Sem mensalidade — pague só uma vez',
                  'Aprovação em até 24 horas',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ backgroundColor: '#dcfce7', borderRadius: '6px', padding: '2px', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#16a34a' }}>check</span>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>

              <button onClick={handlePay} disabled={loading} style={{ width: '100%', backgroundColor: PRIMARY, color: '#fff', fontWeight: '800', fontSize: '16px', padding: '18px', borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1, marginBottom: '10px', boxShadow: `0 8px 24px ${PRIMARY}40` }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                {loading ? 'Aguarde...' : 'Pagar R$ 14,90 e finalizar'}
              </button>

              <button type="button" onClick={() => setStep(2)} style={{ width: '100%', backgroundColor: 'transparent', border: '1.5px solid #e5e7eb', color: '#6b7280', fontWeight: '700', fontSize: '14px', padding: '14px', borderRadius: '12px', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Voltar
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
                Pagamento 100% seguro via Mercado Pago
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
