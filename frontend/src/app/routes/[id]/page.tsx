'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ===== MOCK DATA =====
const MOCK_ROUTES: Record<number, any> = {
  1: {
    id: 1,
    name_kz: 'Жасыл белдеу серуені',
    name_ru: 'Прогулка по зеленому поясу',
    description_kz: `Астананың жасыл белдеуі арқылы өтетін таңғажайып маршрут. Табиғат аясында демалып, таза ауамен тыныс алыңыз.

Бұл маршрут қалалық шу мен тыныштықтан алыс, табиғаттың құшағында өтеді. Жол бойында сіз түрлі өсімдіктерді, құстарды және жануарларды көре аласыз.

Маршрут бойында демалыс орындары, дәретхана және таза су көздері бар. Жаяу жүру немесе велосипедпен өтуге болады.`,
    region: 'green_belt',
    type: 'walking',
    difficulty: 'easy',
    distance_km: 12,
    duration_hours: 3,
    eco_bonus: 50,
    rating: 4.8,
    reviews_count: 234,
    elevation_gain: 85,
    max_elevation: 420,
    best_season: 'Көктем-Күз',
    start_point: { lat: 51.1605, lng: 71.4306, name: 'Жасыл белдеу басы' },
    end_point: { lat: 51.1705, lng: 71.4506, name: 'Демалыс паркі' },
    highlights: ['Таза ауа', 'Көл жағасы', 'Құс бақылау', 'Пикник аймағы'],
    amenities: ['🚻 Дәретхана', '🚰 Су', '🅿️ Көлік тұрағы', '🏕️ Кемпинг'],
    warnings: ['Күн сәулесінен қорғаныңыз', 'Су алып жүріңіз'],
  },
  2: {
    id: 2,
    name_kz: 'Бурабай шыңына шығу',
    name_ru: 'Восхождение на пик Бурабай',
    description_kz: `Қазақстанның Швейцариясы - Бурабайдың ең әдемі шыңына шығу маршруты.

Бұл маршрут тәжірибелі туристерге арналған. Жол қиын, бірақ шыңға жеткенде ашылатын көрініс барлық қиындықтарды ұмыттырады.

Жол бойында сіз қарағай ормандарын, тау өзендерін және керемет көлдерді көресіз.`,
    region: 'burabay',
    type: 'walking',
    difficulty: 'medium',
    distance_km: 18,
    duration_hours: 5,
    eco_bonus: 100,
    rating: 4.9,
    reviews_count: 189,
    elevation_gain: 650,
    max_elevation: 1025,
    best_season: 'Жаз',
    start_point: { lat: 53.0829, lng: 70.4442, name: 'Бурабай кіреберісі' },
    end_point: { lat: 53.0929, lng: 70.4542, name: 'Бурабай шыңы' },
    highlights: ['Тау көріністері', 'Қарағай ормандары', 'Тау көлдері', 'Жабайы табиғат'],
    amenities: ['🚻 Дәретхана', '🏠 Баспана', '🍴 Тамақтану'],
    warnings: ['Ауа райын тексеріңіз', 'Жылы киім алыңыз', 'Гидсіз бармаңыз'],
  },
  3: {
    id: 3,
    name_kz: 'Қорғалжын көлдері',
    name_ru: 'Озера Коргалжына',
    description_kz: `UNESCO қорығындағы фламинголарды көру маршруты. Ерекше құстарды бақылау мүмкіндігі.

Қорғалжын мемлекеттік қорығы - құстардың миграция жолында орналасқан ерекше орын. Мұнда 350-ден астам құс түрі тіршілік етеді.

Розалы фламинголар, аққулар және басқа да сирек кездесетін құстарды көру мүмкіндігі.`,
    region: 'korgalzhyn',
    type: 'cycling',
    difficulty: 'easy',
    distance_km: 8,
    duration_hours: 2,
    eco_bonus: 40,
    rating: 4.7,
    reviews_count: 156,
    elevation_gain: 15,
    max_elevation: 330,
    best_season: 'Мамыр-Қыркүйек',
    start_point: { lat: 50.4617, lng: 69.1899, name: 'Қорғалжын кіреберісі' },
    end_point: { lat: 50.4717, lng: 69.1999, name: 'Фламинго көлі' },
    highlights: ['Фламинголар', 'Аққулар', 'Құс бақылау', 'Фотосуретке түсу'],
    amenities: ['🔭 Бақылау алаңы', '🚻 Дәретхана', '📷 Фото нүктелері'],
    warnings: ['Құстарды қорқытпаңыз', 'Тыныш жүріңіз'],
  },
};

const MOCK_REVIEWS = [
  {
    id: 1,
    user: 'Айгүл К.',
    avatar: '👩',
    rating: 5,
    date: '2026-02-20',
    text: 'Керемет маршрут! Табиғат өте әдемі, таза ауа. Балаларға да қолайлы.',
    photos: 2,
  },
  {
    id: 2,
    user: 'Болат М.',
    avatar: '👨',
    rating: 5,
    date: '2026-02-18',
    text: 'Жақсы ұйымдастырылған маршрут. Гид өте тәжірибелі болды.',
    photos: 5,
  },
  {
    id: 3,
    user: 'Мадина С.',
    avatar: '👩',
    rating: 4,
    date: '2026-02-15',
    text: 'Көріністер керемет, бірақ кейбір жерлерде жол қиын.',
    photos: 3,
  },
];

const MOCK_GUIDES = [
  {
    id: 1,
    name: 'Мұрат Әлиев',
    avatar: '👨',
    rating: 4.9,
    tours: 89,
    price: 15000,
    languages: ['🇰🇿', '🇷🇺', '🇬🇧'],
  },
  {
    id: 2,
    name: 'Айгүл Қасымова',
    avatar: '👩',
    rating: 4.8,
    tours: 67,
    price: 12000,
    languages: ['🇰🇿', '🇷🇺'],
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

const getRegionInfo = (region: string) => {
  const info: Record<string, { icon: string; name: string; color: string }> = {
    green_belt: { icon: '🌲', name: 'Жасыл белдеу', color: '#22C55E' },
    burabay: { icon: '🏔️', name: 'Бурабай', color: '#3B82F6' },
    korgalzhyn: { icon: '🦩', name: 'Қорғалжын', color: '#EC4899' },
  };
  return info[region] || { icon: '🌍', name: region, color: '#6B7280' };
};

// ===== COMPONENT =====
export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = Number(params.id);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'guides'>('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const [groupSize, setGroupSize] = useState(1);

  // Fetch route data
  const { data: routeData, isLoading } = useQuery({
    queryKey: ['route', routeId],
    queryFn: async () => {
      try {
        const res = await api.get(`/routes/${routeId}`);
        return res.data;
      } catch {
        return MOCK_ROUTES[routeId] || MOCK_ROUTES[1];
      }
    },
  });

  const route = routeData || MOCK_ROUTES[routeId] || MOCK_ROUTES[1];
  const diffStyle = getDifficultyStyle(route.difficulty);
  const regionInfo = getRegionInfo(route.region);

  const handleBooking = () => {
    if (!selectedDate || !selectedGuide) {
      alert('Күн мен гидті таңдаңыз');
      return;
    }
    router.push(`/booking/${route.id}?date=${selectedDate}&guide=${selectedGuide}&size=${groupSize}`);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFFFE',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p style={{ color: '#64748B' }}>Жүктелуде...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; background: #FAFFFE; }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => router.back()}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  border: '2px solid #E2E8F0',
                  background: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ←
              </button>
              <Link href="/landing" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
              }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
                  Eco<span style={{ color: '#22C55E' }}>Route</span>
                </span>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '2px solid #E2E8F0',
                background: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ❤️ Сақтау
              </button>
              <button style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '2px solid #E2E8F0',
                background: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                📤 Бөлісу
              </button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <section style={{
          height: '400px',
          background: `linear-gradient(135deg, ${regionInfo.color}88 0%, ${regionInfo.color} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{ fontSize: '120px' }}>{regionInfo.icon}</div>
          
          {/* Badges */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'flex',
            gap: '12px',
          }}>
            <div style={{
              background: diffStyle.bg,
              color: diffStyle.text,
              padding: '10px 18px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
            }}>
              {diffStyle.label}
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '10px 18px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              ⭐ {route.rating} <span style={{ color: '#64748B', fontWeight: 500 }}>({route.reviews_count})</span>
            </div>
          </div>

          {/* Eco Bonus */}
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '12px 20px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <span style={{ fontSize: '24px' }}>🌱</span>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Eco-bonus</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#16A34A' }}>+{route.eco_bonus}</div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '40px',
          marginTop: '-60px',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* Left Column - Content */}
          <div>
            {/* Title Card */}
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              marginBottom: '24px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '20px' }}>{regionInfo.icon}</span>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>{regionInfo.name}</span>
              </div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '16px',
              }}>
                {route.name_kz}
              </h1>

              {/* Quick Stats */}
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#F1F5F9',
                  borderRadius: '14px',
                }}>
                  <span style={{ fontSize: '20px' }}>📏</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Қашықтық</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{route.distance_km} км</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#F1F5F9',
                  borderRadius: '14px',
                }}>
                  <span style={{ fontSize: '20px' }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Ұзақтығы</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{route.duration_hours} сағат</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#F1F5F9',
                  borderRadius: '14px',
                }}>
                  <span style={{ fontSize: '20px' }}>⛰️</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Биіктік</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{route.elevation_gain || 0} м</div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#F1F5F9',
                  borderRadius: '14px',
                }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Маусым</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{route.best_season || 'Жыл бойы'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {[
                { key: 'overview', label: '📋 Жалпы ақпарат' },
                { key: 'reviews', label: `💬 Пікірлер (${route.reviews_count})` },
                { key: 'guides', label: '👨‍🏫 Гидтер' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: activeTab === tab.key
                      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : '#fff',
                    color: activeTab === tab.key ? '#fff' : '#64748B',
                    boxShadow: activeTab === tab.key
                      ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                      : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                {/* Description */}
                <div style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  marginBottom: '24px',
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
                    Маршрут туралы
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: 1.8,
                    color: '#475569',
                    whiteSpace: 'pre-line',
                  }}>
                    {route.description_kz}
                  </p>
                </div>

                {/* Highlights */}
                {route.highlights && (
                  <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    marginBottom: '24px',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
                      ✨ Ерекшеліктері
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {route.highlights.map((h: string, i: number) => (
                        <div key={i} style={{
                          padding: '12px 20px',
                          background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#16A34A',
                        }}>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {route.amenities && (
                  <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    marginBottom: '24px',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>
                      🏕️ Қызметтер мен мүмкіндіктер
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {route.amenities.map((a: string, i: number) => (
                        <div key={i} style={{
                          padding: '12px 20px',
                          background: '#F1F5F9',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#475569',
                        }}>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {route.warnings && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '24px',
                    padding: '32px',
                    border: '2px solid #F59E0B',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#D97706', marginBottom: '16px' }}>
                      ⚠️ Ескертулер
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {route.warnings.map((w: string, i: number) => (
                        <li key={i} style={{
                          fontSize: '15px',
                          color: '#92400E',
                          marginBottom: '8px',
                        }}>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}>
                          {review.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{review.user}</div>
                          <div style={{ fontSize: '13px', color: '#64748B' }}>{review.date}</div>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#FEF3C7',
                        padding: '6px 12px',
                        borderRadius: '10px',
                      }}>
                        <span>⭐</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{review.rating}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                      {review.text}
                    </p>
                    {review.photos > 0 && (
                      <div style={{
                        marginTop: '16px',
                        fontSize: '13px',
                        color: '#3B82F6',
                        cursor: 'pointer',
                      }}>
                        📷 {review.photos} фото
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'guides' && (
              <div>
                {MOCK_GUIDES.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide.id)}
                    style={{
                      background: '#fff',
                      borderRadius: '24px',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                      marginBottom: '16px',
                      cursor: 'pointer',
                      border: selectedGuide === guide.id ? '2px solid #22C55E' : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                        }}>
                          {guide.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>{guide.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <span style={{ fontSize: '14px', color: '#64748B' }}>⭐ {guide.rating}</span>
                            <span style={{ fontSize: '14px', color: '#64748B' }}>🎯 {guide.tours} тур</span>
                            <span style={{ fontSize: '14px' }}>{guide.languages.join(' ')}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>
                          {guide.price.toLocaleString()} ₸
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>адам/сағат</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '100px',
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
                🎫 Брондау
              </h3>

              {/* Date Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Күнді таңдаңыз
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '2px solid #E2E8F0',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Group Size */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                  Адам саны
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: '2px solid #E2E8F0',
                      background: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', minWidth: '40px', textAlign: 'center' }}>
                    {groupSize}
                  </span>
                  <button
                    onClick={() => setGroupSize(Math.min(10, groupSize + 1))}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: '2px solid #E2E8F0',
                      background: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selected Guide Info */}
              {selectedGuide && (
                <div style={{
                  background: '#F0FDF9',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '2px solid #86EFAC',
                }}>
                  <div style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600, marginBottom: '8px' }}>
                    ✓ Таңдалған гид
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    {MOCK_GUIDES.find(g => g.id === selectedGuide)?.name}
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B' }}>Гид қызметі</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>
                    {selectedGuide ? `${(MOCK_GUIDES.find(g => g.id === selectedGuide)?.price || 0).toLocaleString()} ₸` : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B' }}>Адам саны</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>× {groupSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B' }}>Ұзақтығы</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{route.duration_hours} сағат</span>
                </div>
                <div style={{
                  borderTop: '2px solid #E2E8F0',
                  paddingTop: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Барлығы</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>
                    {selectedGuide
                      ? `${((MOCK_GUIDES.find(g => g.id === selectedGuide)?.price || 0) * groupSize * route.duration_hours).toLocaleString()} ₸`
                      : '—'
                    }
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedGuide}
                style={{
                  width: '100%',
                  padding: '18px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: selectedDate && selectedGuide ? 'pointer' : 'not-allowed',
                  background: selectedDate && selectedGuide
                    ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                    : '#E2E8F0',
                  color: selectedDate && selectedGuide ? '#fff' : '#94A3B8',
                  boxShadow: selectedDate && selectedGuide
                    ? '0 8px 24px rgba(34, 197, 94, 0.4)'
                    : 'none',
                  transition: 'all 0.3s',
                }}
              >
                🎫 Брондау
              </button>

              {/* Eco Bonus Info */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                borderRadius: '14px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600 }}>
                  🌱 Осы маршрут үшін <strong>+{route.eco_bonus} Eco-bonus</strong> аласыз!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section style={{
          maxWidth: '1400px',
          margin: '60px auto',
          padding: '0 24px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
              🗺️ Маршрут картасы
            </h3>
            <div style={{
              height: '400px',
              background: 'linear-gradient(135deg, #DCFCE7, #F0FDF9)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <span style={{ fontSize: '64px' }}>🗺️</span>
              <Link href="/map" style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '14px',
                textDecoration: 'none',
              }}>
                Толық картада көру →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#0F172A',
          padding: '40px 24px',
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
              © 2026 EcoRoute Astana
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
