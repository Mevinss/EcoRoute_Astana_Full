'use client';

import { useState } from 'react';
import Link from 'next/link';

// ===== MOCK DATA =====
const MOCK_GUIDES = [
  {
    id: 1,
    name: 'Мұрат Әлиев',
    avatar: '👨',
    photo: null,
    rating: 4.9,
    reviews_count: 127,
    tours_completed: 340,
    price_per_hour: 15000,
    languages: ['kz', 'ru', 'en'],
    regions: ['green_belt', 'burabay', 'korgalzhyn'],
    specializations: ['hiking', 'bird_watching', 'photography'],
    experience_years: 8,
    bio: 'Табиғатты сүйемін, 8 жыл тәжірибем бар. Қазақстанның барлық ұлттық саябақтарын білемін. Фотосуретке түсіруге көмектесемін.',
    verified: true,
    eco_certified: true,
    response_time: '1 сағат ішінде',
  },
  {
    id: 2,
    name: 'Айгүл Қасымова',
    avatar: '👩',
    photo: null,
    rating: 4.8,
    reviews_count: 89,
    tours_completed: 215,
    price_per_hour: 12000,
    languages: ['kz', 'ru'],
    regions: ['green_belt', 'almaty_region'],
    specializations: ['hiking', 'botany', 'culture'],
    experience_years: 5,
    bio: 'Ботаника бойынша білімім бар, өсімдіктер әлемін таныстырамын. Мәдени экскурсияларды да ұйымдастырамын.',
    verified: true,
    eco_certified: true,
    response_time: '30 минут ішінде',
  },
  {
    id: 3,
    name: 'Ержан Тілеуов',
    avatar: '🧔',
    photo: null,
    rating: 4.7,
    reviews_count: 56,
    tours_completed: 120,
    price_per_hour: 18000,
    languages: ['kz', 'ru', 'en', 'de'],
    regions: ['burabay', 'bayanaul', 'charyn'],
    specializations: ['extreme', 'mountaineering', 'survival'],
    experience_years: 12,
    bio: 'Экстремалды туризм бойынша сертификатталған гидпін. Таулардан өтуге, альпинизмге машықтымын.',
    verified: true,
    eco_certified: false,
    response_time: '2 сағат ішінде',
  },
  {
    id: 4,
    name: 'Сара Нұрланқызы',
    avatar: '👩‍🦱',
    photo: null,
    rating: 4.9,
    reviews_count: 203,
    tours_completed: 480,
    price_per_hour: 10000,
    languages: ['kz', 'ru'],
    regions: ['green_belt', 'nur_sultan'],
    specializations: ['family', 'education', 'city_tours'],
    experience_years: 6,
    bio: 'Балаларға арналған білім беру бағдарламалары. Отбасылық экскурсиялар, табиғатты танып білу.',
    verified: true,
    eco_certified: true,
    response_time: '15 минут ішінде',
  },
  {
    id: 5,
    name: 'Бауыржан Серікұлы',
    avatar: '👴',
    photo: null,
    rating: 4.6,
    reviews_count: 42,
    tours_completed: 95,
    price_per_hour: 8000,
    languages: ['kz', 'ru'],
    regions: ['korgalzhyn', 'green_belt'],
    specializations: ['bird_watching', 'wildlife'],
    experience_years: 15,
    bio: 'Қорғалжын қорығын 15 жыл зерттеп келемін. Құстарды бақылау, жабайы табиғат туризмі.',
    verified: true,
    eco_certified: true,
    response_time: '3 сағат ішінде',
  },
  {
    id: 6,
    name: 'Дана Оразбекова',
    avatar: '👱‍♀️',
    photo: null,
    rating: 4.8,
    reviews_count: 78,
    tours_completed: 160,
    price_per_hour: 14000,
    languages: ['kz', 'ru', 'en', 'tr'],
    regions: ['almaty_region', 'charyn', 'kolsai'],
    specializations: ['photography', 'hiking', 'yoga'],
    experience_years: 4,
    bio: 'Фотограф-гид. Табиғат йога-туры ұйымдастырамын. Колсай көлдерін жақсы білемін.',
    verified: true,
    eco_certified: true,
    response_time: '1 сағат ішінде',
  },
];

const REGIONS = [
  { value: '', label: 'Барлық аймақтар' },
  { value: 'green_belt', label: 'Жасыл белдеу' },
  { value: 'burabay', label: 'Бурабай' },
  { value: 'korgalzhyn', label: 'Қорғалжын' },
  { value: 'almaty_region', label: 'Алматы өңірі' },
  { value: 'charyn', label: 'Шарын' },
  { value: 'bayanaul', label: 'Баянауыл' },
  { value: 'kolsai', label: 'Көлсай' },
  { value: 'nur_sultan', label: 'Астана' },
];

const LANGUAGES = [
  { value: '', label: 'Барлық тілдер' },
  { value: 'kz', label: '🇰🇿 Қазақша' },
  { value: 'ru', label: '🇷🇺 Орысша' },
  { value: 'en', label: '🇬🇧 Ағылшынша' },
  { value: 'de', label: '🇩🇪 Немісше' },
  { value: 'tr', label: '🇹🇷 Түрікше' },
];

const SPECIALIZATIONS = [
  { value: '', label: 'Барлық мамандықтар' },
  { value: 'hiking', label: '🥾 Жаяу жүріс' },
  { value: 'bird_watching', label: '🦅 Құс бақылау' },
  { value: 'photography', label: '📸 Фотография' },
  { value: 'extreme', label: '⛰️ Экстрим' },
  { value: 'family', label: '👨‍👩‍👧‍👦 Отбасылық' },
  { value: 'culture', label: '🏛️ Мәдениет' },
  { value: 'botany', label: '🌿 Ботаника' },
];

const LANGUAGE_FLAGS: Record<string, string> = {
  kz: '🇰🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
  de: '🇩🇪',
  tr: '🇹🇷',
};

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'experience'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter guides
  let filteredGuides = MOCK_GUIDES.filter((guide) => {
    if (searchQuery && !guide.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRegion && !guide.regions.includes(selectedRegion)) return false;
    if (selectedLanguage && !guide.languages.includes(selectedLanguage)) return false;
    if (selectedSpec && !guide.specializations.includes(selectedSpec)) return false;
    return true;
  });
  
  // Sort
  filteredGuides.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price_low':
        return a.price_per_hour - b.price_per_hour;
      case 'price_high':
        return b.price_per_hour - a.price_per_hour;
      case 'experience':
        return b.experience_years - a.experience_years;
      default:
        return 0;
    }
  });
  
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; background: #FAFFFE; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .guide-card {
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .guide-card:nth-child(1) { animation-delay: 0.05s; }
        .guide-card:nth-child(2) { animation-delay: 0.1s; }
        .guide-card:nth-child(3) { animation-delay: 0.15s; }
        .guide-card:nth-child(4) { animation-delay: 0.2s; }
        .guide-card:nth-child(5) { animation-delay: 0.25s; }
        .guide-card:nth-child(6) { animation-delay: 0.3s; }
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
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
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
                EcoRoute
              </span>
            </Link>
            
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link href="/routes" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
                Маршруттар
              </Link>
              <Link href="/guides" style={{ color: '#22C55E', textDecoration: 'none', fontWeight: 600 }}>
                Гидтер
              </Link>
              <Link href="/map" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
                Карта
              </Link>
            </nav>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/auth/login" style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '2px solid #22C55E',
                background: '#fff',
                color: '#16A34A',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Кіру
              </Link>
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 50%, #ECFDF5 100%)',
          padding: '60px 32px',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              Тәжірибелі гидтер 🧭
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#475569',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}>
              Біздің сертификатталған эко-гидтер сізге табиғаттың сұлулығын көрсетеді
            </p>
            
            {/* Search */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                flex: '1 1 400px',
                position: 'relative',
              }}>
                <input
                  type="text"
                  placeholder="Гид атын іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '18px 24px 18px 56px',
                    borderRadius: '16px',
                    border: '2px solid #E2E8F0',
                    fontSize: '16px',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '22px',
                  color: '#64748B',
                }}>
                  🔍
                </span>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '18px 28px',
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  background: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#475569',
                }}
              >
                ⚙️ Сүзгілер
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #E2E8F0',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  {REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #E2E8F0',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #E2E8F0',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #E2E8F0',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  <option value="rating">⭐ Рейтинг</option>
                  <option value="price_low">💰 Бағасы (төмен)</option>
                  <option value="price_high">💰 Бағасы (жоғары)</option>
                  <option value="experience">📅 Тәжірибесі</option>
                </select>
              </div>
            )}
          </div>
        </section>
        
        {/* Stats Bar */}
        <section style={{
          background: '#fff',
          borderBottom: '1px solid #F1F5F9',
          padding: '20px 32px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div style={{ fontSize: '16px', color: '#64748B' }}>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>{filteredGuides.length}</span> гид табылды
            </div>
            
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Eco-сертификатталған</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Верификацияланған</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Guides Grid */}
        <section style={{ padding: '48px 32px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {filteredGuides.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                  Гидтер табылмады
                </h3>
                <p style={{ fontSize: '16px', color: '#64748B' }}>
                  Сүзгілерді өзгертіп көріңіз
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '24px',
              }}>
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="guide-card"
                    style={{
                      background: '#fff',
                      borderRadius: '24px',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px',
                        flexShrink: 0,
                      }}>
                        {guide.avatar}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                            {guide.name}
                          </h3>
                          {guide.verified && (
                            <span title="Верификацияланған" style={{ fontSize: '16px' }}>✅</span>
                          )}
                          {guide.eco_certified && (
                            <span title="Eco-сертификатталған" style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                              color: '#16A34A',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}>
                              🌱 ECO
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#F59E0B',
                          }}>
                            ⭐ {guide.rating}
                          </span>
                          <span style={{ fontSize: '14px', color: '#64748B' }}>
                            ({guide.reviews_count} пікір)
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '14px', color: '#64748B' }}>
                          📅 {guide.experience_years} жыл тәжірибе · 🚀 {guide.tours_completed} тур
                        </div>
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                      height: '44px',
                      overflow: 'hidden',
                    }}>
                      {guide.bio}
                    </p>
                    
                    {/* Languages */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>Тілдері:</span>
                        {guide.languages.map((lang) => (
                          <span key={lang} style={{ fontSize: '16px' }}>
                            {LANGUAGE_FLAGS[lang]}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Response Time */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '20px',
                      padding: '10px 14px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                    }}>
                      <span style={{ fontSize: '16px' }}>⚡</span>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>
                        Жауап береді: <span style={{ fontWeight: 600, color: '#0F172A' }}>{guide.response_time}</span>
                      </span>
                    </div>
                    
                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid #F1F5F9',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>Бағасы</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A' }}>
                          {guide.price_per_hour.toLocaleString()} ₸
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>/сағат</span>
                        </div>
                      </div>
                      
                      <Link href={`/routes?guide=${guide.id}`} style={{
                        padding: '14px 24px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      }}>
                        Брондау
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Become a Guide CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          padding: '80px 32px',
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 24px',
            }}>
              🤝
            </div>
            
            <h2 style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
            }}>
              Гид болғыңыз келе ме?
            </h2>
            
            <p style={{
              fontSize: '18px',
              color: '#94A3B8',
              marginBottom: '32px',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}>
              EcoRoute платформасына қосылыңыз және табиғатты сүйетіндерге жол көрсетіңіз. 
              Икемді жұмыс кестесі, тұрақты кіріс, eco-қауымдастық.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '48px',
            }}>
              <div style={{
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                color: '#fff',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E' }}>0%</div>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>комиссия 3 ай</div>
              </div>
              <div style={{
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                color: '#fff',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E' }}>500+</div>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>гидтер</div>
              </div>
              <div style={{
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                color: '#fff',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E' }}>10K+</div>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>турлар/ай</div>
              </div>
            </div>
            
            <Link href="/guide/dashboard" style={{
              display: 'inline-block',
              padding: '18px 40px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: '#fff',
              fontSize: '17px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
            }}>
              Гид ретінде тіркелу →
            </Link>
          </div>
        </section>
        
        {/* Footer */}
        <footer style={{
          background: '#fff',
          borderTop: '1px solid #F1F5F9',
          padding: '40px 32px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🌿</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>EcoRoute Astana</span>
            </div>
            
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              © 2024 EcoRoute. Барлық құқықтар қорғалған.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
