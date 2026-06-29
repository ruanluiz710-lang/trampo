import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: 'rgba(26,26,26,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#D95D39', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: '900', fontSize: '20px', lineHeight: 1 }}>T</span>
          </div>
          <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '22px', letterSpacing: '-0.03em' }}>TRAMPO</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/profissionais" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          >
            Encontrar profissional
          </Link>
          <Link to="/cadastro" style={{ backgroundColor: '#D95D39', color: '#ffffff', fontSize: '14px', fontWeight: '700', padding: '10px 22px', borderRadius: '999px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(217,93,57,0.3)' }}>
            Sou profissional
          </Link>
        </nav>
      </div>
    </header>
  )
}
