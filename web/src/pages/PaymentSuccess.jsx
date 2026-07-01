import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const f = "'Plus Jakarta Sans', sans-serif"

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    // Tenta pegar payment_id de todos os parâmetros que o MP pode enviar
    const payment_id = searchParams.get('payment_id') || searchParams.get('collection_id')
    const paymentStatus = searchParams.get('status') || searchParams.get('collection_status')
    const external_reference = searchParams.get('external_reference')

    // Se não tem payment_id, o webhook já cuidou — mostra sucesso direto
    if (!payment_id) {
      setStatus('success')
      return
    }

    // Se status não é approved nem in_process, mostra erro
    if (paymentStatus && paymentStatus !== 'approved' && paymentStatus !== 'in_process') {
      setStatus('error')
      return
    }

    // Tenta confirmar via API (pode já ter sido salvo pelo webhook)
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/payment/confirm?payment_id=${payment_id}&status=${paymentStatus}&external_reference=${encodeURIComponent(external_reference || '')}`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        // already_saved = webhook já salvou, success = confirmou agora
        if (data.success || data.already_saved) {
          setStatus('success')
        } else {
          // Mesmo com erro na confirmação, se o MP disse approved, mostra sucesso
          // O webhook já salvou ou vai salvar em instantes
          setStatus(paymentStatus === 'approved' ? 'success' : 'error')
        }
      })
      .catch(() => {
        // Erro de rede — mas se MP redirecionou aqui, pagamento foi aprovado
        // O webhook já salvou o cadastro
        setStatus(paymentStatus === 'approved' ? 'success' : 'error')
      })
  }, [])

  const SuccessContent = () => (
    <>
      <div style={{ width: '96px', height: '96px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
        <span style={{ fontSize: '48px', lineHeight: 1 }}>🎉</span>
      </div>
      <h2 style={{ fontWeight: '900', fontSize: '2rem', color: '#1C1C1C', marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: f }}>
        Tudo certo, bem-vindo ao Trampo!
      </h2>
      <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '28px', fontFamily: f }}>
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
              <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500', lineHeight: '1.5', fontFamily: f }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Link to="/" style={{ display: 'inline-block', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none', fontFamily: f }}>
        Voltar para o início
      </Link>
    </>
  )

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: f }}>
      <Navbar />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>⏳</div>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', color: '#1C1C1C', marginBottom: '12px', fontFamily: f }}>Confirmando pagamento...</h2>
            <p style={{ color: '#9ca3af', fontFamily: f }}>Aguarde um instante</p>
          </>
        )}

        {status === 'success' && <SuccessContent />}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>❌</div>
            <h2 style={{ fontWeight: '900', fontSize: '1.8rem', color: '#1C1C1C', marginBottom: '12px', fontFamily: f }}>Algo deu errado</h2>
            <p style={{ color: '#9ca3af', marginBottom: '8px', fontFamily: f }}>Não conseguimos confirmar seu pagamento.</p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '32px', fontFamily: f }}>
              Se o pagamento foi aprovado, seu cadastro será salvo automaticamente. Aguarde alguns minutos.
            </p>
            <Link to="/cadastro" style={{ display: 'inline-block', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none', fontFamily: f }}>
              Tentar novamente
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
