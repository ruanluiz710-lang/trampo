import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const payment_id = searchParams.get('payment_id')
    const paymentStatus = searchParams.get('status')
    const external_reference = searchParams.get('external_reference')

    if (!payment_id || paymentStatus !== 'approved') {
      setStatus('error')
      return
    }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/payment/confirm?payment_id=${payment_id}&status=${paymentStatus}&external_reference=${encodeURIComponent(external_reference)}`)
      .then(r => r.json())
      .then(data => setStatus(data.success ? 'success' : 'error'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>⏳</div>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', color: '#1C1C1C', marginBottom: '12px' }}>Confirmando pagamento...</h2>
            <p style={{ color: '#9ca3af' }}>Aguarde um instante</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: '96px', height: '96px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <span style={{ fontSize: '48px', lineHeight: 1 }}>🎉</span>
            </div>
            <h2 style={{ fontWeight: '900', fontSize: '2rem', color: '#1C1C1C', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Tudo certo, bem-vindo ao Trampo!
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '28px' }}>
              Seu cadastro foi recebido com sucesso e já está sendo analisado pela nossa equipe.
            </p>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '36px', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: '🔍', text: 'Nossa equipe vai revisar suas informações' },
                  { icon: '✅', text: 'Após aprovado, seu perfil aparece na lista de profissionais' },
                  { icon: '📲', text: 'Os clientes entram em contato direto pelo seu WhatsApp' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500', lineHeight: '1.5' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/" style={{ display: 'inline-block', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none' }}>
              Voltar para o início
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>❌</div>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', color: '#1C1C1C', marginBottom: '12px' }}>Algo deu errado</h2>
            <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Não conseguimos confirmar seu pagamento. Tente novamente.</p>
            <Link to="/cadastro" style={{ display: 'inline-block', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none' }}>
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
