'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

// Mock data
const MOCK_USER = {
  name: 'Арман Қасымов',
  email: 'arman@mail.kz',
  phone: '+7 777 123 45 67',
  ecoBonus: 1250,
  level: 'Жасыл турист',
  totalRoutes: 12,
  totalDistance: 85.5,
  co2Saved: 2.8,
  // Eco Actions stats
  trashBagsCollected: 23,
  treesPlanted: 4,
  recyclingActions: 15,
  ecoPhotos: 12,
  ecoRank: 6,
};

const MOCK_BOOKINGS = [
  {
    id: 1,
    route: 'Бурабай шыңына шығу',
    guide: 'Болат Серікұлы',
    date: '2026-02-28',
    time: '07:00',
    people: 2,
    price: 35000,
    status: 'confirmed',
  },
  {
    id: 2,
    route: 'Қорғалжын көлдері',
    guide: 'Мадина Әлиева',
    date: '2026-03-05',
    time: '09:00',
    people: 4,
    price: 30000,
    status: 'pending',
  },
];

const MOCK_HISTORY = [
  {
    id: 1,
    route: 'Жасыл белдеу серуені',
    date: '2026-02-15',
    distance: 12,
    ecoBonus: 50,
    rating: 5,
  },
  {
    id: 2,
    route: 'Есіл өзені жағасы',
    date: '2026-02-10',
    distance: 8,
    ecoBonus: 35,
    rating: 4,
  },
  {
    id: 3,
    route: 'Ботаникалық бақ',
    date: '2026-02-05',
    distance: 5,
    ecoBonus: 25,
    rating: 5,
  },
];

const ECO_LEVELS = [
  { min: 0, max: 500, name: '🌱 Бастаушы', color: '#6B7280' },
  { min: 501, max: 1000, name: '🌿 Жасыл турист', color: '#22C55E' },
  { min: 1001, max: 2000, name: '🌲 Eco чемпион', color: '#16A34A' },
  { min: 2001, max: Infinity, name: '🏆 Табиғат қорғаушы', color: '#059669' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'history' | 'settings'>('overview');

  const currentLevel = ECO_LEVELS.find(
    (l) => MOCK_USER.ecoBonus >= l.min && MOCK_USER.ecoBonus <= l.max
  ) || ECO_LEVELS[0];

  const nextLevel = ECO_LEVELS.find((l) => l.min > MOCK_USER.ecoBonus);
  const progressToNext = nextLevel
    ? ((MOCK_USER.ecoBonus - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-cream via-white to-eco-pale">
      {/* Header */}
      <header className="bg-white border-b-2 border-eco-bright shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
            >
              🌿
            </div>
            <span className="text-xl font-extrabold text-eco-black">
              Eco<span className="text-eco-green">Route</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/map" className="text-eco-text hover:text-eco-green font-semibold transition-colors">
              Карта
            </Link>
            <Link href="/routes" className="text-eco-text hover:text-eco-green font-semibold transition-colors">
              Маршруттар
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', border: '2px solid #86EFAC' }}
            >
              <span className="text-lg">🌱</span>
              <span className="font-bold text-eco-green">{MOCK_USER.ecoBonus} балл</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-3xl p-6 shadow-card sticky top-24"
              style={{ border: '2px solid #DCFCE7' }}
            >
              {/* Avatar */}
              <div className="text-center mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', border: '4px solid #86EFAC' }}
                >
                  👤
                </div>
                <h2 className="text-xl font-bold text-eco-black">{user?.name || MOCK_USER.name}</h2>
                <p className="text-sm text-eco-muted">{user?.email || MOCK_USER.email}</p>
                
                {/* Level badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-3"
                  style={{ background: `${currentLevel.color}15`, border: `2px solid ${currentLevel.color}30` }}
                >
                  <span className="font-bold" style={{ color: currentLevel.color }}>
                    {currentLevel.name}
                  </span>
                </div>
              </div>

              {/* Eco Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-eco-muted">Eco-bonus прогресі</span>
                  <span className="font-bold text-eco-green">{MOCK_USER.ecoBonus} балл</span>
                </div>
                <div className="h-3 bg-eco-pale rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressToNext}%`,
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    }}
                  />
                </div>
                {nextLevel && (
                  <p className="text-xs text-eco-muted mt-2">
                    {nextLevel.name} деңгейіне дейін {nextLevel.min - MOCK_USER.ecoBonus} балл
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  ['🗺️', MOCK_USER.totalRoutes, 'Маршрут'],
                  ['📏', `${MOCK_USER.totalDistance}км`, 'Жүрілген'],
                  ['🌱', `${MOCK_USER.co2Saved}кг`, 'CO₂'],
                ].map(([icon, value, label]) => (
                  <div key={String(label)} className="text-center p-3 bg-eco-cream rounded-xl">
                    <div className="text-xl">{icon}</div>
                    <div className="font-bold text-eco-black text-sm">{value}</div>
                    <div className="text-xs text-eco-muted">{label}</div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', icon: '📊', label: 'Шолу' },
                  { id: 'bookings', icon: '📅', label: 'Брондарым' },
                  { id: 'history', icon: '🏆', label: 'Тарих' },
                  { id: 'settings', icon: '⚙️', label: 'Параметрлер' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === item.id
                        ? 'bg-eco-green text-white'
                        : 'text-eco-muted hover:bg-eco-pale hover:text-eco-green'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-eco-rose hover:bg-red-50 transition-colors"
              >
                <span className="text-xl">🚪</span>
                Шығу
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-eco-black">
                  Сәлем, {MOCK_USER.name.split(' ')[0]}! 👋
                </h1>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { icon: '🌱', value: MOCK_USER.ecoBonus, label: 'Eco-bonus', color: '#22C55E' },
                    { icon: '🗺️', value: MOCK_USER.totalRoutes, label: 'Маршрут', color: '#38BDF8' },
                    { icon: '📏', value: `${MOCK_USER.totalDistance}км`, label: 'Жүрілген жол', color: '#FBBF24' },
                    { icon: '🌍', value: `${MOCK_USER.co2Saved}кг`, label: 'CO₂ үнемі', color: '#22C55E' },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-5 shadow-card animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.1}s`, border: '2px solid #DCFCE7' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{stat.icon}</span>
                      </div>
                      <div className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-sm text-eco-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Upcoming bookings */}
                <div
                  className="bg-white rounded-2xl p-6 shadow-card"
                  style={{ border: '2px solid #DCFCE7' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-eco-black">📅 Алдағы брондар</h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-eco-green font-semibold text-sm hover:underline"
                    >
                      Барлығы →
                    </button>
                  </div>

                  {MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length > 0 ? (
                    <div className="space-y-3">
                      {MOCK_BOOKINGS.filter(b => b.status === 'confirmed').map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 rounded-xl bg-gradient-to-r from-eco-cream to-white flex items-center justify-between"
                          style={{ border: '1px solid #DCFCE7' }}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
                            >
                              🏕️
                            </div>
                            <div>
                              <p className="font-bold text-eco-black">{booking.route}</p>
                              <p className="text-sm text-eco-muted">
                                👨‍🏫 {booking.guide} • 👥 {booking.people} адам
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-eco-green">{booking.date}</p>
                            <p className="text-sm text-eco-muted">{booking.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-eco-muted">
                      <span className="text-4xl block mb-2">📭</span>
                      Алдағы брондар жоқ
                    </div>
                  )}
                </div>

                {/* Eco Actions Section */}
                <div
                  className="bg-white rounded-2xl p-6 shadow-card"
                  style={{ border: '2px solid #DCFCE7' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-eco-black">♻️ Eco Actions</h3>
                    <Link
                      href="/eco-actions"
                      className="text-eco-green font-semibold text-sm hover:underline"
                    >
                      Барлығы →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { icon: '🗑️', value: MOCK_USER.trashBagsCollected, label: 'Қап жиналды', color: '#22C55E' },
                      { icon: '🌳', value: MOCK_USER.treesPlanted, label: 'Ағаш отырғызылды', color: '#16A34A' },
                      { icon: '♻️', value: MOCK_USER.recyclingActions, label: 'Recycling', color: '#3B82F6' },
                      { icon: '🏆', value: `#${MOCK_USER.ecoRank}`, label: 'Рейтинг', color: '#F59E0B' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-4 rounded-xl"
                        style={{ background: `${stat.color}10` }}
                      >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs text-eco-muted">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/eco-actions"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-eco-green bg-eco-pale hover:bg-eco-mint transition-colors"
                  >
                    🌱 Bonus жинау →
                  </Link>
                </div>

                {/* Quick actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Link
                    href="/map"
                    className="bg-gradient-to-r from-eco-green to-eco-green2 rounded-2xl p-6 text-white flex items-center gap-4 hover:scale-[1.02] transition-transform"
                    style={{ boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)' }}
                  >
                    <span className="text-4xl">🗺️</span>
                    <div>
                      <h3 className="text-xl font-bold">Картаны ашу</h3>
                      <p className="text-eco-mint text-sm">Жаңа маршруттарды табыңыз</p>
                    </div>
                  </Link>
                  
                  <Link
                    href="/eco-actions"
                    className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:shadow-eco transition-all"
                    style={{ border: '2px solid #DCFCE7' }}
                  >
                    <span className="text-4xl">♻️</span>
                    <div>
                      <h3 className="text-xl font-bold text-eco-black">Eco Actions</h3>
                      <p className="text-eco-muted text-sm">Қоқыс жинап bonus ал!</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-eco-black">📅 Менің брондарым</h1>

                <div className="space-y-4">
                  {MOCK_BOOKINGS.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl p-6 shadow-card"
                      style={{ border: '2px solid #DCFCE7' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                            style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
                          >
                            🏕️
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-eco-black">{booking.route}</h3>
                            <p className="text-eco-muted">👨‍🏫 Гид: {booking.guide}</p>
                            <p className="text-eco-muted">👥 {booking.people} адам</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                              booking.status === 'confirmed'
                                ? 'bg-eco-pale text-eco-green'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {booking.status === 'confirmed' ? '✓ Расталған' : '⏳ Күтілуде'}
                          </span>
                          <p className="font-bold text-eco-green text-xl mt-2">{booking.price.toLocaleString()}₸</p>
                          <p className="text-eco-muted text-sm">📅 {booking.date} • {booking.time}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-eco-border">
                        <button className="flex-1 py-2 rounded-xl font-semibold text-eco-green bg-eco-pale hover:bg-eco-mint transition-colors">
                          📍 Картада көру
                        </button>
                        {booking.status === 'pending' && (
                          <button className="px-4 py-2 rounded-xl font-semibold text-eco-rose bg-red-50 hover:bg-red-100 transition-colors">
                            Бас тарту
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-eco-black">🏆 Тарих</h1>

                <div className="space-y-4">
                  {MOCK_HISTORY.map((item, i) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 shadow-card flex items-center justify-between animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.1}s`, border: '2px solid #DCFCE7' }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
                        >
                          ✓
                        </div>
                        <div>
                          <p className="font-bold text-eco-black">{item.route}</p>
                          <p className="text-sm text-eco-muted">{item.date} • {item.distance} км</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-eco-amber font-bold">
                            {'⭐'.repeat(item.rating)}
                          </p>
                        </div>
                        <div
                          className="px-4 py-2 rounded-xl font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
                        >
                          +{item.ecoBonus} балл
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-eco-black">⚙️ Параметрлер</h1>

                <div
                  className="bg-white rounded-2xl p-6 shadow-card space-y-6"
                  style={{ border: '2px solid #DCFCE7' }}
                >
                  <div>
                    <h3 className="text-lg font-bold text-eco-black mb-4">👤 Жеке мәліметтер</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-eco-muted mb-2">Аты-жөні</label>
                        <input
                          defaultValue={MOCK_USER.name}
                          className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-eco-muted mb-2">Email</label>
                        <input
                          defaultValue={MOCK_USER.email}
                          className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-eco-muted mb-2">Телефон</label>
                        <input
                          defaultValue={MOCK_USER.phone}
                          className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-eco-border" />

                  <div>
                    <h3 className="text-lg font-bold text-eco-black mb-4">🌐 Тіл</h3>
                    <select className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all">
                      <option value="kz">🇰🇿 Қазақша</option>
                      <option value="ru">🇷🇺 Русский</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>

                  <hr className="border-eco-border" />

                  <div>
                    <h3 className="text-lg font-bold text-eco-black mb-4">🔔 Хабарландырулар</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Email хабарландырулар', defaultChecked: true },
                        { label: 'Push хабарландырулар', defaultChecked: true },
                        { label: 'SMS хабарландырулар', defaultChecked: false },
                      ].map((item) => (
                        <label key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-eco-cream cursor-pointer">
                          <span className="font-medium text-eco-black">{item.label}</span>
                          <input
                            type="checkbox"
                            defaultChecked={item.defaultChecked}
                            className="w-5 h-5 accent-eco-green"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full py-4 rounded-xl font-bold text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    💾 Сақтау
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
