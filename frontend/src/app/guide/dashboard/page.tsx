'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

// Mock data
const MOCK_STATS = {
  totalTours: 45,
  thisMonth: 8,
  rating: 4.8,
  income: 250000,
  pendingBookings: 3,
};

const MOCK_BOOKINGS = [
  {
    id: 1,
    route: 'Жасыл белдеу серуені',
    tourist: 'Айгерім Сәрсенова',
    date: '2026-02-26',
    time: '09:00',
    people: 4,
    price: 20000,
    status: 'pending',
  },
  {
    id: 2,
    route: 'Бурабай шыңына шығу',
    tourist: 'Арман Қасымов',
    date: '2026-02-28',
    time: '07:00',
    people: 2,
    price: 35000,
    status: 'pending',
  },
  {
    id: 3,
    route: 'Қорғалжын көлдері',
    tourist: 'Мадина Әлиева',
    date: '2026-03-02',
    time: '10:00',
    people: 6,
    price: 30000,
    status: 'pending',
  },
];

const MOCK_TOURS = [
  {
    id: 1,
    name: 'Жасыл белдеу серуені',
    region: 'Астана',
    price: 5000,
    duration: '3 сағат',
    bookings: 12,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Бурабай экспедиция',
    region: 'Бурабай',
    price: 15000,
    duration: '8 сағат',
    bookings: 8,
    rating: 4.7,
  },
];

const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  booked: [5, 12, 15, 20, 25].includes(i + 1),
  available: ![5, 12, 15, 20, 25].includes(i + 1) && i + 1 >= new Date().getDate(),
}));

export default function GuideDashboard() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tours' | 'calendar'>('overview');
  const [showNewTourModal, setShowNewTourModal] = useState(false);

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

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-eco-muted hover:text-eco-green transition-colors">
              <span className="text-xl">🔔</span>
              {MOCK_STATS.pendingBookings > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-eco-rose text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {MOCK_STATS.pendingBookings}
                </span>
              )}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l-2 border-eco-border">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
              >
                👤
              </div>
              <div>
                <p className="font-bold text-eco-black text-sm">{user?.name || 'Гид'}</p>
                <p className="text-xs text-eco-green font-medium">🎯 Верификацияланған</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-eco-black">
              Сәлем, {user?.name?.split(' ')[0] || 'Гид'}! 👋
            </h1>
            <p className="text-eco-muted mt-1">
              Гид панеліне қош келдіңіз
            </p>
          </div>
          
          <button
            onClick={() => setShowNewTourModal(true)}
            className="px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
            }}
          >
            <span className="text-xl">+</span>
            Жаңа тур құру
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🎯', value: MOCK_STATS.totalTours, label: 'Жалпы турлар', color: '#22C55E' },
            { icon: '📅', value: MOCK_STATS.thisMonth, label: 'Бұл айда', color: '#38BDF8' },
            { icon: '⭐', value: MOCK_STATS.rating, label: 'Рейтинг', color: '#FBBF24' },
            { icon: '💰', value: `${(MOCK_STATS.income / 1000).toFixed(0)}к₸`, label: 'Табыс', color: '#22C55E' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-card animate-fadeInUp"
              style={{ border: '2px solid #DCFCE7' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{stat.icon}</span>
                <span
                  className="px-2 py-1 rounded-lg text-xs font-bold"
                  style={{ background: `${stat.color}20`, color: stat.color }}
                >
                  +12%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-eco-black">{stat.value}</div>
              <div className="text-sm text-eco-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 bg-eco-pale rounded-xl w-fit">
          {[
            { id: 'overview', label: '📊 Шолу', icon: '📊' },
            { id: 'bookings', label: '📬 Тапсырыстар', badge: MOCK_STATS.pendingBookings },
            { id: 'tours', label: '🏕️ Турларым' },
            { id: 'calendar', label: '📅 Күнтізбе' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-eco-green shadow-md'
                  : 'text-eco-muted hover:text-eco-green2'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="w-5 h-5 bg-eco-rose text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fadeIn">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pending bookings */}
              <div
                className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card"
                style={{ border: '2px solid #DCFCE7' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-eco-black">📬 Жаңа тапсырыстар</h3>
                  <Link href="#" onClick={() => setActiveTab('bookings')} className="text-eco-green font-semibold text-sm hover:underline">
                    Барлығын көру →
                  </Link>
                </div>

                <div className="space-y-3">
                  {MOCK_BOOKINGS.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl bg-eco-cream flex items-center justify-between"
                      style={{ border: '1px solid #DCFCE7' }}
                    >
                      <div>
                        <p className="font-bold text-eco-black">{booking.route}</p>
                        <p className="text-sm text-eco-muted">
                          {booking.tourist} • {booking.people} адам
                        </p>
                        <p className="text-sm text-eco-green font-semibold mt-1">
                          📅 {booking.date} • {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-eco-green text-lg">{booking.price.toLocaleString()}₸</p>
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-1.5 bg-eco-green text-white text-sm font-bold rounded-lg hover:bg-eco-green2 transition-colors">
                            ✓ Қабылдау
                          </button>
                          <button className="px-3 py-1.5 bg-eco-pale text-eco-muted text-sm font-bold rounded-lg hover:bg-eco-border transition-colors">
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini calendar */}
              <div
                className="bg-white rounded-2xl p-6 shadow-card"
                style={{ border: '2px solid #DCFCE7' }}
              >
                <h3 className="text-lg font-bold text-eco-black mb-4">📅 Ақпан 2026</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жк'].map((d) => (
                    <div key={d} className="py-2 text-eco-muted font-medium">{d}</div>
                  ))}
                  {CALENDAR_DAYS.map((day) => (
                    <div
                      key={day.day}
                      className={`py-2 rounded-lg font-medium transition-colors ${
                        day.booked
                          ? 'bg-eco-amber/20 text-eco-amber'
                          : day.available
                            ? 'bg-eco-pale text-eco-green hover:bg-eco-mint cursor-pointer'
                            : 'text-eco-muted'
                      }`}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-eco-pale"></span> Бос
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-eco-amber/20"></span> Бронь
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <div
              className="bg-white rounded-2xl p-6 shadow-card"
              style={{ border: '2px solid #DCFCE7' }}
            >
              <h3 className="text-lg font-bold text-eco-black mb-6">📬 Барлық тапсырыстар</h3>
              
              <div className="space-y-4">
                {MOCK_BOOKINGS.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-gradient-to-r from-eco-cream to-white flex items-center justify-between"
                    style={{ border: '2px solid #DCFCE7' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
                      >
                        🏕️
                      </div>
                      <div>
                        <p className="font-bold text-eco-black text-lg">{booking.route}</p>
                        <p className="text-eco-muted">
                          👤 {booking.tourist} • 👥 {booking.people} адам
                        </p>
                        <p className="text-eco-green font-semibold mt-1">
                          📅 {booking.date} • ⏰ {booking.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-extrabold text-eco-green text-2xl">{booking.price.toLocaleString()}₸</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="px-5 py-2 rounded-xl font-bold text-white transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}
                        >
                          ✓ Қабылдау
                        </button>
                        <button className="px-5 py-2 rounded-xl font-bold text-eco-muted bg-eco-pale hover:bg-eco-border transition-colors">
                          ✕ Бас тарту
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Tours */}
          {activeTab === 'tours' && (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TOURS.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-eco transition-all"
                    style={{ border: '2px solid #DCFCE7' }}
                  >
                    <div
                      className="h-40 flex items-center justify-center text-6xl"
                      style={{ background: 'linear-gradient(135deg, #ECFDF5, #DCFCE7)' }}
                    >
                      🏕️
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-eco-black">{tour.name}</h4>
                          <p className="text-sm text-eco-muted">{tour.region}</p>
                        </div>
                        <span className="flex items-center gap-1 px-2 py-1 bg-eco-pale rounded-lg text-sm font-bold">
                          ⭐ {tour.rating}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-eco-muted mb-4">
                        <span>⏱ {tour.duration}</span>
                        <span>👥 {tour.bookings} бронь</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xl font-extrabold text-eco-green">{tour.price.toLocaleString()}₸</p>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg bg-eco-pale text-eco-green hover:bg-eco-mint transition-colors">
                            ✏️
                          </button>
                          <button className="p-2 rounded-lg bg-eco-pale text-eco-rose hover:bg-red-100 transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new tour card */}
                <button
                  onClick={() => setShowNewTourModal(true)}
                  className="bg-eco-pale border-2 border-dashed border-eco-bright rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-eco-mint hover:border-eco-green transition-all min-h-[300px]"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
                  >
                    +
                  </div>
                  <p className="font-bold text-eco-green">Жаңа тур құру</p>
                </button>
              </div>
            </div>
          )}

          {/* Calendar */}
          {activeTab === 'calendar' && (
            <div
              className="bg-white rounded-2xl p-8 shadow-card"
              style={{ border: '2px solid #DCFCE7' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-eco-black">📅 Ақпан 2026</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-eco-pale text-eco-green hover:bg-eco-mint transition-colors">
                    ←
                  </button>
                  <button className="p-2 rounded-lg bg-eco-pale text-eco-green hover:bg-eco-mint transition-colors">
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {['Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Бейсенбі', 'Жұма', 'Сенбі', 'Жексенбі'].map((d) => (
                  <div key={d} className="py-3 text-eco-muted font-semibold text-sm">{d}</div>
                ))}
                {CALENDAR_DAYS.map((day) => (
                  <div
                    key={day.day}
                    className={`py-6 rounded-xl font-bold text-lg transition-all cursor-pointer ${
                      day.booked
                        ? 'bg-eco-amber/20 text-eco-amber border-2 border-eco-amber/30'
                        : day.available
                          ? 'bg-eco-pale text-eco-green hover:bg-eco-mint hover:scale-105 border-2 border-transparent'
                          : 'text-eco-muted bg-gray-50'
                    }`}
                  >
                    {day.day}
                    {day.booked && <div className="text-xs mt-1">1 бронь</div>}
                  </div>
                ))}
              </div>

              <div className="flex gap-6 mt-6 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-eco-pale border-2 border-eco-bright"></span> Бос күн
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-eco-amber/20 border-2 border-eco-amber/30"></span> Брондалған
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-gray-50"></span> Өткен күн
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Tour Modal */}
      {showNewTourModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeInUp"
            style={{ border: '2px solid #DCFCE7' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-eco-black">🏕️ Жаңа тур құру</h3>
              <button
                onClick={() => setShowNewTourModal(false)}
                className="p-2 rounded-lg bg-eco-pale text-eco-muted hover:bg-eco-border transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-eco-black mb-2">
                  Тур атауы (Қазақша)
                </label>
                <input
                  placeholder="Мысалы: Жасыл белдеу серуені"
                  className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-eco-black mb-2">
                  Аймақ
                </label>
                <select className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all">
                  <option value="">Таңдаңыз</option>
                  <option value="green_belt">🌲 Жасыл белдеу</option>
                  <option value="burabay">🏔️ Бурабай</option>
                  <option value="korgalzhyn">🦩 Қорғалжын</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-eco-black mb-2">
                    Ұзақтығы
                  </label>
                  <input
                    placeholder="3 сағат"
                    className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-eco-black mb-2">
                    Бағасы (₸)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-eco-black mb-2">
                  Сипаттама
                </label>
                <textarea
                  rows={4}
                  placeholder="Тур туралы толық ақпарат..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-eco-border bg-eco-cream focus:border-eco-green outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowNewTourModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-eco-muted bg-eco-pale hover:bg-eco-border transition-colors"
                >
                  Бас тарту
                </button>
                <button
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  ✓ Сақтау
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
