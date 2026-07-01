import { Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useIsMobile'

export default function Navbar() {
  const isMobile = useIsMobile()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: 'rgba(26,26,26,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 32px',
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Trampo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
          <span style={{ color: '#ffffff', fontWeight: '900', fontSize: isMobile ? '18px' : '22px', letterSpacing: '-0.03em' }}>TRAMPO</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '28px' }}>
          {!isMobile && (
            <Link to="/profissionais"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              Encontrar profissional
            </Link>
          )}
          <Link to="/cadastro" style={{
            backgroundColor: '#D95D39', color: '#ffffff',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '700',
            padding: isMobile ? '8px 14px' : '10px 22px',
            borderRadius: '999px', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(217,93,57,0.3)',
            whiteSpace: 'nowrap',
          }}>
            {isMobile ? 'Cadastrar' : 'Sou profissional'}
          </Link>
        </nav>
      </div>
    </header>
  )
}
