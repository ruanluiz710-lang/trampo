import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PaymentFailed() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F5F5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>😕</div>
        <h2 style={{ fontWeight: '900', fontSize: '2rem', color: '#1C1C1C', marginBottom: '14px' }}>Pagamento não realizado</h2>
        <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.7', marginBottom: '36px' }}>
          O pagamento não foi concluído. Tente novamente para finalizar seu cadastro.
        </p>
        <Link to="/cadastro" style={{ display: 'inline-block', backgroundColor: '#D85A30', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 36px', borderRadius: '12px', textDecoration: 'none' }}>
          Tentar novamente
        </Link>
      </div>
    </div>
  )
}
