'use client';

import { useState } from 'react';
import Link from 'next/link';

// ===== MOCK DATA =====
const CHALLENGES = [
  {
    id: 1,
    title: '🗑️ Қоқыс жинау',
    description: 'Маршрут бойында қоқыс жинаңыз',
    bonus: 100,
    unit: 'қап үшін',
    icon: '🗑️',
    color: '#22C55E',
    howTo: 'Қоқыс қабын толтырып, фотосын жүктеңіз',
    completed: 3,
    total: 5,
  },
  {
    id: 2,
    title: '♻️ Recycling',
    description: 'Қайта өңдеу контейнеріне тастаңыз',
    bonus: 50,
    unit: 'әрекет үшін',
    icon: '♻️',
    color: '#3B82F6',
    howTo: 'QR кодты сканерлеп, recycling bin-ге тастаңыз',
    completed: 8,
    total: 10,
  },
  {
    id: 3,
    title: '🌱 Ағаш отырғызу',
    description: 'Eco іс-шарасында ағаш отырғызыңыз',
    bonus: 500,
    unit: 'ағаш үшін',
    icon: '🌱',
    color: '#16A34A',
    howTo: 'Eco іс-шарасына қатысып, ағаш отырғызыңыз',
    completed: 1,
    total: 3,
  },
  {
    id: 4,
    title: '📸 Eco фото',
    description: 'Табиғатты қорғау туралы фото',
    bonus: 25,
    unit: 'фото үшін',
    icon: '📸',
    color: '#8B5CF6',
    howTo: 'Eco-тақырыптағы фотоңызды #EcoRoute хэштегімен жүктеңіз',
    completed: 12,
    total: 20,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Арман Қ.', avatar: '👨', points: 4850, badge: '🏆' },
  { rank: 2, name: 'Айгүл М.', avatar: '👩', points: 4200, badge: '🥈' },
  { rank: 3, name: 'Мұрат Т.', avatar: '👨', points: 3890, badge: '🥉' },
  { rank: 4, name: 'Дана С.', avatar: '👩', points: 3450, badge: '' },
  { rank: 5, name: 'Болат Е.', avatar: '👨', points: 3120, badge: '' },
  { rank: 6, name: 'Сіз', avatar: '👤', points: 1250, badge: '', isUser: true },
];

const REWARDS = [
  { id: 1, name: 'Eco сөмке', price: 500, icon: '🛍️', stock: 15 },
  { id: 2, name: 'Бамбук термос', price: 1000, icon: '🥤', stock: 8 },
  { id: 3, name: 'Тегін тур', price: 2500, icon: '🎫', stock: 3 },
  { id: 4, name: 'Eco футболка', price: 800, icon: '👕', stock: 20 },
  { id: 5, name: 'Ағаш атыңызға', price: 5000, icon: '🌳', stock: 10 },
  { id: 6, name: 'VIP гид тур', price: 10000, icon: '🌟', stock: 2 },
];

const RECENT_ACTIVITIES = [
  { user: 'Арман Қ.', action: '5 қап қоқыс жинады', time: '2 сағат бұрын', bonus: 500, icon: '🗑️' },
  { user: 'Айгүл М.', action: '3 ағаш отырғызды', time: '5 сағат бұрын', bonus: 1500, icon: '🌱' },
  { user: 'Мұрат Т.', action: 'Recycling - 15 бөтелке', time: '1 күн бұрын', bonus: 150, icon: '♻️' },
];

export default function EcoActionsPage() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'rewards'>('challenges');
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof CHALLENGES[0] | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const userPoints = 1250;
  const userRank = 6;
  
  const handleUpload = () => {
    // Simulate upload
    setTimeout(() => {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadModal(false);
        setUploadSuccess(false);
        setSelectedChallenge(null);
      }, 2000);
    }, 1500);
  };
  
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; background: #FAFFFE; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
        }
        .animate-fade { animation: fadeUp 0.5s ease forwards; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
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
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
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
            
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link href="/routes" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
                Маршруттар
              </Link>
              <Link href="/eco-actions" style={{ color: '#22C55E', textDecoration: 'none', fontWeight: 600 }}>
                🌱 Eco Actions
              </Link>
              <Link href="/map" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>
                Карта
              </Link>
            </nav>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '10px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                border: '2px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>🌱</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>{userPoints} балл</span>
              </div>
              <Link href="/profile" style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#F1F5F9',
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
        
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 50%, #ECFDF5 100%)',
          padding: '60px 24px',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-pulse" style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              margin: '0 auto 24px',
              boxShadow: '0 12px 40px rgba(34, 197, 94, 0.35)',
            }}>
              ♻️
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              Eco Actions 🌍
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#475569',
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}>
              Қоқыс жина, recycling жаса, bonus ал! Табиғатты тазарту үшін қосылыңыз.
            </p>
            
            {/* User Stats */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '🌱', value: userPoints, label: 'Eco балл' },
                { icon: '🏆', value: `#${userRank}`, label: 'Рейтинг' },
                { icon: '🗑️', value: '23', label: 'Қап жиналды' },
                { icon: '🌳', value: '4', label: 'Ағаш отырғыздым' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '20px 32px',
                  borderRadius: '20px',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '2px solid #DCFCE7',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#16A34A' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tabs */}
        <section style={{ background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: '8px',
          }}>
            {[
              { id: 'challenges', label: '🎯 Тапсырмалар', count: CHALLENGES.length },
              { id: 'leaderboard', label: '🏆 Рейтинг', count: null },
              { id: 'rewards', label: '🎁 Сыйлықтар', count: REWARDS.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '20px 28px',
                  borderRadius: '0',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #22C55E' : '3px solid transparent',
                  background: 'transparent',
                  fontSize: '16px',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#16A34A' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
                {tab.count && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: activeTab === tab.id ? '#DCFCE7' : '#F1F5F9',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
        
        {/* Content */}
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px',
                }}>
                  {CHALLENGES.map((challenge, i) => (
                    <div
                      key={challenge.id}
                      className="animate-fade"
                      style={{
                        background: '#fff',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                        border: '2px solid #DCFCE7',
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0,
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        background: `${challenge.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        marginBottom: '16px',
                      }}>
                        {challenge.icon}
                      </div>
                      
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                        {challenge.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', lineHeight: 1.5 }}>
                        {challenge.description}
                      </p>
                      
                      {/* Progress */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#64748B' }}>Прогресс</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: challenge.color }}>
                            {challenge.completed}/{challenge.total}
                          </span>
                        </div>
                        <div style={{
                          height: '8px',
                          background: '#F1F5F9',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${(challenge.completed / challenge.total) * 100}%`,
                            background: challenge.color,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>
                      
                      {/* Bonus */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                      }}>
                        <span style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                          color: '#16A34A',
                          fontSize: '15px',
                          fontWeight: 700,
                        }}>
                          +{challenge.bonus} балл
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>{challenge.unit}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedChallenge(challenge);
                          setUploadModal(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '14px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                          color: '#fff',
                          fontSize: '15px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        📸 Фото жүктеу
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Recent Activities */}
                <div style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '2px solid #DCFCE7',
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
                    ⚡ Соңғы әрекеттер
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {RECENT_ACTIVITIES.map((activity, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        background: '#F8FAFC',
                        borderRadius: '14px',
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}>
                          {activity.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                            {activity.user} — {activity.action}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B' }}>{activity.time}</div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#DCFCE7',
                          color: '#16A34A',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}>
                          +{activity.bonus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '2px solid #DCFCE7',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', textAlign: 'center' }}>
                  🏆 Eco Champions
                </h2>
                <p style={{ fontSize: '15px', color: '#64748B', textAlign: 'center', marginBottom: '32px' }}>
                  Осы айдың үздік eco-белсенділері
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {LEADERBOARD.map((user) => (
                    <div
                      key={user.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: user.isUser
                          ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
                          : user.rank <= 3
                            ? '#F8FAFC'
                            : '#fff',
                        border: user.isUser ? '2px solid #86EFAC' : '2px solid #F1F5F9',
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: user.rank === 1 ? '#FEF3C7' : user.rank === 2 ? '#E5E7EB' : user.rank === 3 ? '#FED7AA' : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: user.badge ? '20px' : '14px',
                        fontWeight: 700,
                        color: '#64748B',
                      }}>
                        {user.badge || user.rank}
                      </div>
                      
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: user.isUser ? '#fff' : 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}>
                        {user.avatar}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: user.isUser ? 700 : 600,
                          color: user.isUser ? '#16A34A' : '#0F172A',
                        }}>
                          {user.name} {user.isUser && '(Сіз)'}
                        </div>
                      </div>
                      
                      <div style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: user.isUser ? '#fff' : '#DCFCE7',
                        color: '#16A34A',
                        fontWeight: 700,
                        fontSize: '15px',
                      }}>
                        {user.points.toLocaleString()} 🌱
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 28px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    border: '2px solid #86EFAC',
                  }}>
                    <span style={{ fontSize: '24px' }}>🌱</span>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>{userPoints}</span>
                    <span style={{ fontSize: '16px', color: '#16A34A' }}>балл бар</span>
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '24px',
                }}>
                  {REWARDS.map((reward, i) => {
                    const canAfford = userPoints >= reward.price;
                    return (
                      <div
                        key={reward.id}
                        className="animate-fade"
                        style={{
                          background: '#fff',
                          borderRadius: '24px',
                          padding: '28px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                          border: canAfford ? '2px solid #86EFAC' : '2px solid #E2E8F0',
                          opacity: canAfford ? 1 : 0.7,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '24px',
                          background: canAfford
                            ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
                            : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '40px',
                          margin: '0 auto 16px',
                        }}>
                          {reward.icon}
                        </div>
                        
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#0F172A',
                          textAlign: 'center',
                          marginBottom: '8px',
                        }}>
                          {reward.name}
                        </h3>
                        
                        <div style={{
                          fontSize: '14px',
                          color: '#64748B',
                          textAlign: 'center',
                          marginBottom: '16px',
                        }}>
                          Қалды: {reward.stock} дана
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginBottom: '20px',
                        }}>
                          <span style={{ fontSize: '28px', fontWeight: 800, color: canAfford ? '#16A34A' : '#64748B' }}>
                            {reward.price}
                          </span>
                          <span style={{ fontSize: '18px' }}>🌱</span>
                        </div>
                        
                        <button
                          disabled={!canAfford}
                          style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '14px',
                            border: 'none',
                            background: canAfford
                              ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                              : '#E2E8F0',
                            color: canAfford ? '#fff' : '#94A3B8',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                            boxShadow: canAfford ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none',
                          }}
                        >
                          {canAfford ? '🎁 Алу' : `Тағы ${reward.price - userPoints} керек`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Upload Modal */}
        {uploadModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '28px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}>
              {!uploadSuccess ? (
                <>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    margin: '0 auto 20px',
                  }}>
                    📸
                  </div>
                  
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    {selectedChallenge?.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '24px' }}>
                    {selectedChallenge?.howTo}
                  </p>
                  
                  {/* Upload Area */}
                  <div style={{
                    border: '2px dashed #86EFAC',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    cursor: 'pointer',
                    background: '#F0FDF4',
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
                    <p style={{ fontSize: '15px', color: '#16A34A', fontWeight: 600 }}>
                      Фотоны жүктеу үшін басыңыз
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      JPG, PNG · макс. 10MB
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '12px 16px',
                    background: '#DCFCE7',
                    borderRadius: '12px',
                    marginBottom: '24px',
                  }}>
                    <span style={{ fontSize: '15px', color: '#16A34A', fontWeight: 600 }}>
                      +{selectedChallenge?.bonus} балл аласыз! 🌱
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setUploadModal(false)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        background: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#64748B',
                      }}
                    >
                      Бас тарту
                    </button>
                    <button
                      onClick={handleUpload}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      ✓ Жүктеу
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                  }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    Тамаша! 🎉
                  </h3>
                  <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '16px' }}>
                    Сіздің әрекетіңіз расталды!
                  </p>
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    borderRadius: '16px',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#16A34A',
                  }}>
                    +{selectedChallenge?.bonus} балл 🌱
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer style={{
          background: '#fff',
          borderTop: '1px solid #F1F5F9',
          padding: '40px 24px',
        }}>
          <div style={{
            maxWidth: '1200px',
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
              © 2024 EcoRoute. Табиғатты бірге қорғаймыз! 💚
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
