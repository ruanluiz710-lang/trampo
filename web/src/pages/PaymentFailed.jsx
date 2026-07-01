import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PaymentFailed() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ width: '96px', height: '96px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '48px' }}>
          😕
        </div>
        <h2 style={{ fontWeight: '900', fontSize: '2rem', color: '#1C1C1C', marginBottom: '14px', letterSpacing: '-0.02em' }}>
          Pagamento não concluído
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '12px' }}>
          Não foi possível processar o seu pagamento desta vez.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.7', marginBottom: '36px' }}>
          Não se preocupe — nenhum valor foi cobrado. Você pode tentar novamente quando quiser.
        </p>
        <Link to="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none' }}>
          Tentar novamente
        </Link>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
