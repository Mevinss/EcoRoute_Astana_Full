'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ===== TYPES =====
interface Route {
  id: number;
  name_kz: string;
  name_ru?: string;
  description_kz?: string;
  region: string;
  type: 'walking' | 'cycling' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  distance_km: number;
  duration_hours: number;
  eco_bonus: number;
  rating?: number;
  reviews_count?: number;
  image_url?: string;
}

// ===== CONSTANTS =====
const REGIONS = [
  { key: 'all', label: 'Барлық аймақтар', icon: '🌍' },
  { key: 'green_belt', label: 'Жасыл белдеу', icon: '🌲' },
  { key: 'burabay', label: 'Бурабай', icon: '🏔️' },
  { key: 'korgalzhyn', label: 'Қорғалжын', icon: '🦩' },
];

const TYPES = [
  { key: 'all', label: 'Барлығы', icon: '🗺️' },
  { key: 'walking', label: 'Жаяу жүру', icon: '🚶' },
  { key: 'cycling', label: 'Велосипед', icon: '🚴' },
  { key: 'mixed', label: 'Аралас', icon: '🔄' },
];

const DIFFICULTIES = [
  { key: 'all', label: 'Барлық деңгей', color: '#6B7280' },
  { key: 'easy', label: 'Оңай', color: '#22C55E' },
  { key: 'medium', label: 'Орташа', color: '#F59E0B' },
  { key: 'hard', label: 'Қиын', color: '#EF4444' },
];

const SORT_OPTIONS = [
  { key: 'popular', label: 'Танымал' },
  { key: 'rating', label: 'Рейтинг бойынша' },
  { key: 'distance', label: 'Қашықтық бойынша' },
  { key: 'duration', label: 'Ұзақтық бойынша' },
];

// Mock data for demo
const MOCK_ROUTES: Route[] = [
  {
    id: 1,
    name_kz: 'Жасыл белдеу серуені',
    description_kz: 'Астананың жасыл белдеуі арқылы өтетін таңғажайып маршрут. Табиғат аясында демалып, таза ауамен тыныс алыңыз.',
    region: 'green_belt',
    type: 'walking',
    difficulty: 'easy',
    distance_km: 12,
    duration_hours: 3,
    eco_bonus: 50,
    rating: 4.8,
    reviews_count: 234,
  },
  {
    id: 2,
    name_kz: 'Бурабай шыңына шығу',
    description_kz: 'Қазақстанның Швейцариясы - Бурабайдың ең әдемі шыңына шығу маршруты.',
    region: 'burabay',
    type: 'walking',
    difficulty: 'medium',
    distance_km: 18,
    duration_hours: 5,
    eco_bonus: 100,
    rating: 4.9,
    reviews_count: 189,
  },
  {
    id: 3,
    name_kz: 'Қорғалжын көлдері',
    description_kz: 'UNESCO қорығындағы фламинголарды көру маршруты. Ерекше құстарды бақылау мүмкіндігі.',
    region: 'korgalzhyn',
    type: 'cycling',
    difficulty: 'easy',
    distance_km: 8,
    duration_hours: 2,
    eco_bonus: 40,
    rating: 4.7,
    reviews_count: 156,
  },
  {
    id: 4,
    name_kz: 'Есіл өзені бойымен',
    description_kz: 'Астана қаласындағы Есіл өзенінің жағасымен велосипедпен жүру маршруты.',
    region: 'green_belt',
    type: 'cycling',
    difficulty: 'easy',
    distance_km: 15,
    duration_hours: 2,
    eco_bonus: 45,
    rating: 4.6,
    reviews_count: 312,
  },
  {
    id: 5,
    name_kz: 'Оқжетпес тауы',
    description_kz: 'Бурабайдағы аңызға айналған Оқжетпес тауына шығу. Керемет көріністер күтеді.',
    region: 'burabay',
    type: 'walking',
    difficulty: 'hard',
    distance_km: 22,
    duration_hours: 7,
    eco_bonus: 150,
    rating: 4.9,
    reviews_count: 98,
  },
  {
    id: 6,
    name_kz: 'Ботаникалық бақ маршруты',
    description_kz: 'Астананың ботаникалық бағы арқылы өтетін танымдық серуен.',
    region: 'green_belt',
    type: 'mixed',
    difficulty: 'easy',
    distance_km: 5,
    duration_hours: 1.5,
    eco_bonus: 25,
    rating: 4.5,
    reviews_count: 445,
  },
];

// ===== HELPERS =====
const getDifficultyStyle = (difficulty: string) => {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    easy: { bg: '#DCFCE7', text: '#16A34A', label: 'Оңай' },
    medium: { bg: '#FEF3C7', text: '#D97706', label: 'Орташа' },
    hard: { bg: '#FEE2E2', text: '#DC2626', label: 'Қиын' },
  };
  return styles[difficulty] || styles.easy;
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    walking: '🚶',
    cycling: '🚴',
    mixed: '🔄',
  };
  return icons[type] || '🗺️';
};

const getRegionIcon = (region: string) => {
  const icons: Record<string, string> = {
    green_belt: '🌲',
    burabay: '🏔️',
    korgalzhyn: '🦩',
  };
  return icons[region] || '🌍';
};

const getRegionName = (region: string) => {
  const names: Record<string, string> = {
    green_belt: 'Жасыл белдеу',
    burabay: 'Бурабай',
    korgalzhyn: 'Қорғалжын',
  };
  return names[region] || region;
};

// ===== COMPONENT =====
export default function RoutesPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // API call (falls back to mock data)
  const { data, isLoading } = useQuery({
    queryKey: ['routes', selectedRegion, selectedType],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedRegion !== 'all') params.append('region', selectedRegion);
        if (selectedType !== 'all') params.append('type', selectedType);
        const res = await api.get(`/routes?${params.toString()}`);
        return res.data.routes || MOCK_ROUTES;
      } catch {
        return MOCK_ROUTES;
      }
    },
  });

  const routes = data || MOCK_ROUTES;

  // Filter & Sort
  const filteredRoutes = routes
    .filter((r: Route) => {
      if (selectedRegion !== 'all' && r.region !== selectedRegion) return false;
      if (selectedType !== 'all' && r.type !== selectedType) return false;
      if (selectedDifficulty !== 'all' && r.difficulty !== selectedDifficulty) return false;
      if (searchQuery && !r.name_kz.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a: Route, b: Route) => {
      switch (sortBy) {
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'distance': return a.distance_km - b.distance_km;
        case 'duration': return a.duration_hours - b.duration_hours;
        default: return (b.reviews_count || 0) - (a.reviews_count || 0);
      }
    });

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background: #FAFFFE;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn { animation: fadeInUp 0.5s ease forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#FAFFFE' }}>
        {/* Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(34, 197, 94, 0.1)',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link href="/landing" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
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
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              }}>
                🌿
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
                Eco<span style={{ color: '#22C55E' }}>Route</span>
              </span>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { href: '/map', label: '🗺️ Карта' },
                { href: '/routes', label: '📍 Маршруттар', active: true },
                { href: '/guides', label: '👨‍🏫 Гидтер' },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{
                  padding: '10px 20px',
                  color: item.active ? '#22C55E' : '#64748B',
                  fontWeight: item.active ? 700 : 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  background: item.active ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                }}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/profile" style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                textDecoration: 'none',
              }}>
                👤
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 50%, #ECFDF5 100%)',
          padding: '60px 24px 40px',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '16px',
            }}>
              Экологиялық маршруттар 🗺️
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#64748B',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}>
              Астана, Бурабай және Қорғалжын аймақтарының ең үздік eco-маршруттары
            </p>

            {/* Search */}
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              position: 'relative',
            }}>
              <input
                type="text"
                placeholder="Маршрут іздеу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 24px 18px 56px',
                  fontSize: '16px',
                  border: '2px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '20px',
                  background: '#fff',
                  outline: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              />
              <span style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
              }}>
                🔍
              </span>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section style={{
          background: '#fff',
          borderBottom: '1px solid rgba(34, 197, 94, 0.1)',
          padding: '20px 24px',
          position: 'sticky',
          top: '76px',
          zIndex: 40,
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
          }}>
            {/* Region Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Аймақ:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setSelectedRegion(r.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: selectedRegion === r.key
                        ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                        : '#F1F5F9',
                      color: selectedRegion === r.key ? '#fff' : '#64748B',
                    }}
                  >
                    {r.icon} {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Түрі:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedType(t.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: selectedType === t.key
                        ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                        : '#F1F5F9',
                      color: selectedType === t.key ? '#fff' : '#64748B',
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Деңгей:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDifficulty(d.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: selectedDifficulty === d.key
                        ? d.color
                        : '#F1F5F9',
                      color: selectedDifficulty === d.key ? '#fff' : '#64748B',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Сұрыптау:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '2px solid #E2E8F0',
                  fontSize: '14px',
                  fontWeight: 600,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <p style={{ fontSize: '16px', color: '#64748B' }}>
              Табылды: <strong style={{ color: '#0F172A' }}>{filteredRoutes.length}</strong> маршрут
            </p>
            <Link href="/map" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            }}>
              🗺️ Картада көру
            </Link>
          </div>

          {/* Routes Grid */}
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{
                  background: '#F1F5F9',
                  borderRadius: '24px',
                  height: '400px',
                  animation: 'pulse 2s infinite',
                }} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
            }}>
              {filteredRoutes.map((route: Route, index: number) => {
                const diffStyle = getDifficultyStyle(route.difficulty);
                return (
                  <Link
                    key={route.id}
                    href={`/routes/${route.id}`}
                    className="animate-fadeIn"
                    style={{
                      background: '#fff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(34, 197, 94, 0.1)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    {/* Image Header */}
                    <div style={{
                      height: '180px',
                      background: `linear-gradient(135deg, ${
                        route.region === 'burabay' ? '#3B82F6, #1D4ED8' :
                        route.region === 'korgalzhyn' ? '#EC4899, #DB2777' :
                        '#22C55E, #16A34A'
                      })`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px',
                      position: 'relative',
                    }}>
                      {getRegionIcon(route.region)}
                      
                      {/* Eco Bonus Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '8px 14px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}>
                        <span>🌱</span>
                        <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '14px' }}>
                          +{route.eco_bonus}
                        </span>
                      </div>

                      {/* Difficulty Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        background: diffStyle.bg,
                        color: diffStyle.text,
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}>
                        {diffStyle.label}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '24px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#0F172A',
                            marginBottom: '4px',
                          }}>
                            {route.name_kz}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {getRegionIcon(route.region)} {getRegionName(route.region)}
                          </p>
                        </div>
                        {route.rating && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#FEF3C7',
                            padding: '6px 12px',
                            borderRadius: '10px',
                          }}>
                            <span>⭐</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{route.rating}</span>
                          </div>
                        )}
                      </div>

                      {route.description_kz && (
                        <p style={{
                          fontSize: '14px',
                          color: '#64748B',
                          lineHeight: 1.5,
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {route.description_kz}
                        </p>
                      )}

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #F1F5F9',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>{getTypeIcon(route.type)}</span>
                          <span style={{ fontSize: '14px', color: '#64748B' }}>
                            {route.type === 'walking' ? 'Жаяу' : route.type === 'cycling' ? 'Велосипед' : 'Аралас'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>📏</span>
                          <span style={{ fontSize: '14px', color: '#64748B' }}>{route.distance_km} км</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>⏱️</span>
                          <span style={{ fontSize: '14px', color: '#64748B' }}>{route.duration_hours} сағат</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRoutes.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: '#F8FAFC',
              borderRadius: '24px',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Маршруттар табылмады
              </h3>
              <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '24px' }}>
                Сүзгілерді өзгертіп көріңіз
              </p>
              <button
                onClick={() => {
                  setSelectedRegion('all');
                  setSelectedType('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                }}
              >
                Сүзгілерді тазалау
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer style={{
          background: '#0F172A',
          padding: '40px 24px',
          marginTop: '60px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🌿</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Eco<span style={{ color: '#22C55E' }}>Route</span>
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '14px' }}>
              © 2026 EcoRoute Astana. Барлық құқықтар қорғалған.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
