'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid #F1F5F9',
      padding: '48px 24px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Main Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}>
                🌿
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                Eco<span style={{ color: '#16A34A' }}>Route</span>
              </span>
            </Link>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, maxWidth: '280px' }}>
              Астана мен Қазақстанның экологиялық таза маршруттарын ашыңыз. Табиғатты бірге қорғаймыз! 💚
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Маршруттар
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/routes?region=green_belt', label: 'Жасыл белдеу' },
                { href: '/routes?region=burabay', label: 'Бурабай' },
                { href: '/routes?region=korgalzhyn', label: 'Қорғалжын' },
                { href: '/map', label: 'Карта' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  color: '#64748B',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Қызметтер
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/guides', label: 'Гидтер' },
                { href: '/eco-actions', label: 'Eco Actions' },
                { href: '/booking', label: 'Брондау' },
                { href: '/profile', label: 'Жеке кабинет' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  color: '#64748B',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
              Байланыс
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>Астана, Қазақстан</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📧</span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>info@ecoroute.kz</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📱</span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>+7 (7172) 123-456</span>
              </div>
            </div>
            
            {/* Social */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            © 2024 EcoRoute Astana. Барлық құқықтар қорғалған.
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { href: '/privacy', label: 'Құпиялық саясаты' },
              { href: '/terms', label: 'Қызмет шарттары' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                color: '#64748B',
                textDecoration: 'none',
                fontSize: '13px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
