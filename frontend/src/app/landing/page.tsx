'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// ===== DATA =====
const FEATURES = [
  {
    icon: '🗺️',
    title: 'Интерактивті карта',
    description: 'Астана, Бурабай, Қорғалжын аймақтарының экологиялық маршруттары',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
  },
  {
    icon: '🌿',
    title: 'Eco-bonus жүйесі',
    description: 'Әр жүріс үшін балл жина, жеңілдіктер ал',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  },
  {
    icon: '👨‍🏫',
    title: 'Тәжірибелі гидтер',
    description: 'Верификацияланған жергілікті гидтермен саяхат',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
  {
    icon: '🏕️',
    title: 'POI нүктелері',
    description: 'Кемпинг, демалыс орындары, қоқыс жәшіктері',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
];

const POPULAR_ROUTES = [
  {
    id: 1,
    name: 'Жасыл белдеу',
    region: 'Астана',
    distance: '12 км',
    duration: '3 сағат',
    difficulty: 'easy',
    difficultyLabel: 'Оңай',
    image: '🌲',
    rating: 4.8,
    reviews: 234,
    gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
  },
  {
    id: 2,
    name: 'Бурабай шыңы',
    region: 'Бурабай',
    distance: '18 км',
    duration: '5 сағат',
    difficulty: 'medium',
    difficultyLabel: 'Орташа',
    image: '🏔️',
    rating: 4.9,
    reviews: 189,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  },
  {
    id: 3,
    name: 'Қорғалжын көлдері',
    region: 'Қорғалжын',
    distance: '8 км',
    duration: '2 сағат',
    difficulty: 'easy',
    difficultyLabel: 'Оңай',
    image: '🦩',
    rating: 4.7,
    reviews: 156,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  },
];

const STATS = [
  { value: '25+', label: 'Маршрут', icon: '🗺️', color: '#22C55E' },
  { value: '50+', label: 'Гид', icon: '👨‍🏫', color: '#3B82F6' },
  { value: '1000+', label: 'Турист', icon: '🧳', color: '#8B5CF6' },
  { value: '2.5т', label: 'CO₂ үнемі', color: '#06B6D4', icon: '🌱' },
];

const GUIDES = [
  { name: 'Мұрат Ә.', rating: 4.9, tours: 89, avatar: '👨', specialty: 'Бурабай' },
  { name: 'Айгүл К.', rating: 4.8, tours: 67, avatar: '👩', specialty: 'Жасыл белдеу' },
  { name: 'Арман Б.', rating: 4.9, tours: 124, avatar: '👨', specialty: 'Қорғалжын' },
];

// ===== COMPONENT =====
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { background: '#DCFCE7', color: '#16A34A' };
      case 'medium':
        return { background: '#FEF3C7', color: '#D97706' };
      case 'hard':
        return { background: '#FEE2E2', color: '#DC2626' };
      default:
        return { background: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <>
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #FAFFFE;
          overflow-x: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-scaleIn { animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .routes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .guides-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .nav-links { display: none !important; }
          .routes-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
        }
        
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .routes-grid { grid-template-columns: 1fr !important; }
          .guides-grid { grid-template-columns: 1fr !important; }
          .cta-buttons { flex-direction: column !important; width: 100% !important; }
          .cta-buttons a { width: 100% !important; justify-content: center !important; }
          .auth-buttons { gap: 8px !important; }
          .auth-buttons a { padding: 10px 16px !important; font-size: 14px !important; }
        }
        
        /* Smooth hover transitions */
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.12); }
        .hover-glow:hover { box-shadow: 0 0 30px rgba(34, 197, 94, 0.3); }
        
        /* Text gradient helper */
        .gradient-text {
          background: linear-gradient(135deg, #22C55E 0%, #06B6D4 50%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#FAFFFE',
        position: 'relative',
      }}>
        {/* Animated Background Mesh */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(at 20% 20%, rgba(34, 197, 94, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 10%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 40% 80%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 90% 90%, rgba(6, 182, 212, 0.1) 0px, transparent 50%)
          `,
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* ============ HEADER ============ */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '16px 24px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(isScrolled ? {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
          } : {}),
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Logo */}
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                transform: 'rotate(-5deg)',
              }}>
                🌿
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.5px',
              }}>
                Eco<span style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Route</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="nav-links" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              {[
                { href: '/map', label: '🗺️ Карта' },
                { href: '/routes', label: '📍 Маршруттар' },
                { href: '/guides', label: '👨‍🏫 Гидтер' },
                { href: '/eco-actions', label: '♻️ Eco Actions' },
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  style={{
                    padding: '10px 20px',
                    color: '#475569',
                    fontSize: '15px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="auth-buttons" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <Link href="/auth/login" style={{
                padding: '12px 24px',
                color: '#16A34A',
                fontSize: '15px',
                fontWeight: 600,
                background: 'rgba(34, 197, 94, 0.1)',
                border: 'none',
                borderRadius: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                Кіру
              </Link>
              <Link href="/auth/register" style={{
                padding: '12px 24px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                border: 'none',
                borderRadius: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease',
              }}>
                Тіркелу
              </Link>
            </div>
          </div>
        </header>

        {/* ============ HERO SECTION ============ */}
        <section style={{
          position: 'relative',
          paddingTop: '140px',
          paddingBottom: '80px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div className="hero-grid" style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}>
            {/* Hero Content */}
            <div className="animate-fadeInUp" style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '100px',
                marginBottom: '24px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}>
                <span>🌱</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}>
                  Жасыл туризм платформасы
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(40px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#0F172A',
                marginBottom: '24px',
                letterSpacing: '-1px',
              }}>
                Қазақстанның
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #22C55E 0%, #06B6D4 50%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  табиғатын аш
                </span>
              </h1>

              <p style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: '#64748B',
                marginBottom: '40px',
                maxWidth: '500px',
              }}>
                Астана, Бурабай, Қорғалжын — экологиялық маршруттар, тәжірибелі гидтер 
                және Eco-bonus жүйесі бір платформада. Табиғатты сүй, қорға!
              </p>

              <div className="cta-buttons" style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                <Link href="/auth/login?role=tourist" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '18px 32px',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <span style={{ fontSize: '24px' }}>🧳</span>
                  Турист болу
                  <span>→</span>
                </Link>
                <Link href="/auth/register?role=guide" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '18px 32px',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#0F172A',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  Гид болу
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual" style={{ position: 'relative', height: '600px' }}>
              {/* Main Map Card */}
              <div className="animate-scaleIn" style={{
                position: 'absolute',
                width: '380px',
                height: '420px',
                top: '50px',
                left: '50px',
                transform: 'rotate(-3deg)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.8) inset',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <div style={{
                  width: '100%',
                  height: '260px',
                  background: 'linear-gradient(180deg, #DCFCE7 0%, #BBF7D0 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div className="animate-float" style={{ fontSize: '80px', marginBottom: '16px' }}>
                    🗺️
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#16A34A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                    🌍 3 аймақ
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#3B82F6',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                    📍 25+ маршрут
                  </div>
                </div>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Интерактивті карта
                  </div>
                  <Link href="/map" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                  }}>
                    Картаны ашу →
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <div className="animate-scaleIn delay-200" style={{
                position: 'absolute',
                width: '240px',
                padding: '24px',
                top: '0',
                right: '20px',
                transform: 'rotate(5deg)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    🌱
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Eco-bonus</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>+50</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Әр маршрут үшін балл жина!
                </div>
              </div>

              {/* Route Preview Card */}
              <div className="animate-scaleIn delay-300" style={{
                position: 'absolute',
                width: '280px',
                padding: '20px',
                bottom: '60px',
                right: '60px',
                transform: 'rotate(-2deg)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                  }}>
                    🏔️
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Бурабай шыңы</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '14px', color: '#F59E0B' }}>⭐</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>4.9</span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>(189)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STATS SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '80px 24px',
          zIndex: 2,
        }}>
          <div className="stats-grid" style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fadeInUp delay-${i}00`}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-1px', color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ FEATURES SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '100px 24px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(34, 197, 94, 0.03) 100%)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}>
              Неге <span style={{ color: '#22C55E' }}>EcoRoute</span>?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#64748B',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Қазақстанның табиғатын сақтай отырып, саяхаттау мүмкіндігі
            </p>
          </div>

          <div className="features-grid" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}>
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-fadeInUp delay-${i}00`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '28px',
                  padding: '36px 28px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  ...(hoveredFeature === i ? {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  } : {}),
                }}
              >
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  background: feature.gradient,
                  transition: 'all 0.3s ease',
                  ...(hoveredFeature === i ? { transform: 'scale(1.1) rotate(5deg)' } : {}),
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ ECO ACTIONS SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '100px 24px',
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 50%, #ECFDF5 100%)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '100px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '14px' }}>♻️</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}>ЖАңА</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '16px',
              }}>
                Eco Actions — Қоқыс жина, Bonus ал!
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#475569',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                Маршрут бойында қоқыс жинаңыз, recycling жасаңыз, eco-bonus жинаңыз!
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}>
              {[
                { icon: '🗑️', title: 'Қоқыс жинау', bonus: '+100 балл', desc: 'Әр қап үшін' },
                { icon: '♻️', title: 'Recycling', bonus: '+50 балл', desc: 'Әр әрекет үшін' },
                { icon: '🌱', title: 'Ағаш отырғызу', bonus: '+500 балл', desc: 'Әр ағаш үшін' },
                { icon: '📸', title: 'Eco фото', bonus: '+25 балл', desc: 'Әр фото үшін' },
              ].map((action, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '28px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    border: '2px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '0 auto 16px',
                  }}>
                    {action.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {action.title}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}>
                    {action.bonus}
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>{action.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link
                href="/eco-actions"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '18px 36px',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  border: 'none',
                  borderRadius: '18px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                }}
              >
                🌱 Eco Actions-қа өту →
              </Link>
            </div>
          </div>
        </section>

        {/* ============ ROUTES SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '100px 24px',
        }}>
          <div className="routes-header" style={{
            maxWidth: '1200px',
            margin: '0 auto 48px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '8px',
              }}>
                Танымал маршруттар
              </h2>
              <p style={{ fontSize: '18px', color: '#64748B' }}>
                Ең көп таңдалған экологиялық бағыттар
              </p>
            </div>
            <Link href="/routes" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#0F172A',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px',
              textDecoration: 'none',
            }}>
              Барлығын көру →
            </Link>
          </div>

          <div className="routes-grid" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}>
            {POPULAR_ROUTES.map((route, i) => (
              <Link
                key={route.id}
                href={`/routes/${route.id}`}
                className={`animate-fadeInUp delay-${i}00`}
                onMouseEnter={() => setHoveredRoute(i)}
                onMouseLeave={() => setHoveredRoute(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 32px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  ...(hoveredRoute === i ? {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.12)',
                  } : {}),
                }}
              >
                <div style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '72px',
                  background: route.gradient,
                }}>
                  <span style={{
                    transition: 'all 0.3s ease',
                    ...(hoveredRoute === i ? { transform: 'scale(1.2)' } : {}),
                  }}>
                    {route.image}
                  </span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        {route.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748B' }}>{route.region}</div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                      borderRadius: '12px',
                    }}>
                      <span>⭐</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{route.rating}</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#64748B',
                  }}>
                    <span>📏 {route.distance}</span>
                    <span>⏱️ {route.duration}</span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      ...getDifficultyStyle(route.difficulty),
                    }}>
                      {route.difficultyLabel}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ GUIDES SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '100px 24px',
          background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.03) 0%, rgba(255,255,255,0) 100%)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '16px',
            }}>
              Тәжірибелі гидтер
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
              Верификацияланған жергілікті гидтермен қауіпсіз саяхат
            </p>
          </div>

          <div className="guides-grid" style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {GUIDES.map((guide, i) => (
              <div
                key={guide.name}
                className={`animate-fadeInUp delay-${i}00`}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                }}>
                  {guide.avatar}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {guide.name}
                </div>
                <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>
                  📍 {guide.specialty}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
                  <span>
                    <span style={{ color: '#F59E0B' }}>⭐</span>
                    <span style={{ fontWeight: 700, marginLeft: '4px' }}>{guide.rating}</span>
                  </span>
                  <span>
                    <span style={{ color: '#22C55E' }}>🎯</span>
                    <span style={{ fontWeight: 700, marginLeft: '4px' }}>{guide.tours} тур</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA SECTION ============ */}
        <section style={{
          position: 'relative',
          padding: '100px 24px',
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '80px 60px',
            borderRadius: '40px',
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #059669 100%)',
            boxShadow: '0 32px 80px rgba(34, 197, 94, 0.4)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
            }} />
            
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
              position: 'relative',
            }}>
              Саяхатты бүгіннен баста! 🌿
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px',
              position: 'relative',
            }}>
              Тіркеліп, алғашқы маршрутыңды таңда. Eco-bonus жина, табиғатты сақта.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              position: 'relative',
            }}>
              <Link href="/auth/register" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '18px 36px',
                fontSize: '17px',
                fontWeight: 700,
                color: '#16A34A',
                background: '#fff',
                border: 'none',
                borderRadius: '20px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }}>
                Тегін тіркелу
              </Link>
              <Link href="/map" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '18px 36px',
                fontSize: '17px',
                fontWeight: 700,
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '20px',
                textDecoration: 'none',
              }}>
                🗺️ Картаны көру
              </Link>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer style={{
          background: '#0F172A',
          padding: '80px 24px 40px',
          color: '#fff',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="footer-grid" style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '60px',
              marginBottom: '60px',
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    🌿
                  </div>
                  <span style={{ fontSize: '22px', fontWeight: 800 }}>
                    Eco<span style={{ color: '#22C55E' }}>Route</span>
                  </span>
                </div>
                <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.7 }}>
                  Қазақстанның жасыл туризм платформасы. Табиғатты сүй, қорға, саяхатта!
                </p>
              </div>

              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#22C55E',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Навигация
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { href: '/map', label: '🗺️ Карта' },
                    { href: '/routes', label: '📍 Маршруттар' },
                    { href: '/guides', label: '👨‍🏫 Гидтер' },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} style={{
                        color: '#94A3B8',
                        textDecoration: 'none',
                        fontSize: '15px',
                        display: 'block',
                        padding: '8px 0',
                      }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#22C55E',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Аймақтар
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94A3B8', fontSize: '15px' }}>
                  <li style={{ padding: '8px 0' }}>🌲 Жасыл белдеу</li>
                  <li style={{ padding: '8px 0' }}>🏔️ Бурабай</li>
                  <li style={{ padding: '8px 0' }}>🦩 Қорғалжын</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#22C55E',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Байланыс
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94A3B8', fontSize: '15px' }}>
                  <li style={{ padding: '8px 0' }}>📧 info@ecoroute.kz</li>
                  <li style={{ padding: '8px 0' }}>📞 +7 777 123 45 67</li>
                  <li style={{ padding: '8px 0' }}>📍 Астана, Қазақстан</li>
                </ul>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <p style={{ color: '#64748B', fontSize: '14px' }}>
                © 2026 EcoRoute Astana. Барлық құқықтар қорғалған.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['📱', '💬', '📷'].map((icon, i) => (
                  <div key={i} style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
