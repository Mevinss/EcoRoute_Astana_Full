'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

// ===== MOCK DATA =====
const MOCK_ROUTES: Record<number, any> = {
  1: { id: 1, name_kz: 'Жасыл белдеу серуені', region: 'green_belt', distance_km: 12, duration_hours: 3, eco_bonus: 50 },
  2: { id: 2, name_kz: 'Бурабай шыңына шығу', region: 'burabay', distance_km: 18, duration_hours: 5, eco_bonus: 100 },
  3: { id: 3, name_kz: 'Қорғалжын көлдері', region: 'korgalzhyn', distance_km: 8, duration_hours: 2, eco_bonus: 40 },
};

const MOCK_GUIDES: Record<number, any> = {
  1: { id: 1, name: 'Мұрат Әлиев', avatar: '👨', rating: 4.9, price: 15000, phone: '+7 777 111 22 33' },
  2: { id: 2, name: 'Айгүл Қасымова', avatar: '👩', rating: 4.8, price: 12000, phone: '+7 777 444 55 66' },
};

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
];

// ===== COMPONENT =====
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  
  const routeId = Number(params.id);
  const route = MOCK_ROUTES[routeId] || MOCK_ROUTES[1];
  
  // Get params from URL
  const initialDate = searchParams.get('date') || '';
  const initialGuide = Number(searchParams.get('guide')) || 1;
  const initialSize = Number(searchParams.get('size')) || 1;
  
  const guide = MOCK_GUIDES[initialGuide] || MOCK_GUIDES[1];
  
  // Form state
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState('');
  const [groupSize, setGroupSize] = useState(initialSize);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kaspi' | 'cash'>('kaspi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  // Calculate price
  const totalPrice = guide.price * groupSize * route.duration_hours;
  
  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      alert('Күн мен уақытты таңдаңыз');
      return;
    }
    if (step === 2 && (!contactName || !contactPhone)) {
      alert('Байланыс ақпаратын толтырыңыз');
      return;
    }
    setStep(step + 1);
  };
  
  const handleBooking = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate booking ID
    const id = `ECO-${Date.now().toString(36).toUpperCase()}`;
    setBookingId(id);
    setBookingComplete(true);
    setIsProcessing(false);
  };
  
  // Booking Complete Screen
  if (bookingComplete) {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background: #FAFFFE; }
          @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-check { animation: checkmark 0.5s ease forwards; }
          .animate-fade { animation: fadeIn 0.5s ease forwards; }
        `}</style>
        
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 50%, #ECFDF5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '32px',
            padding: '48px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}>
            <div className="animate-check" style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '48px',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
            }}>
              ✓
            </div>
            
            <h1 className="animate-fade" style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '12px',
              animationDelay: '0.2s',
            }}>
              Брондау сәтті! 🎉
            </h1>
            
            <p className="animate-fade" style={{
              fontSize: '16px',
              color: '#64748B',
              marginBottom: '32px',
              animationDelay: '0.3s',
            }}>
              Сіздің брондау растады. Гид сізбен хабарласады.
            </p>
            
            <div className="animate-fade" style={{
              background: '#F8FAFC',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px',
              animationDelay: '0.4s',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Брондау нөмірі</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', letterSpacing: '2px' }}>
                  {bookingId}
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                textAlign: 'left',
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Маршрут</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{route.name_kz}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Гид</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{guide.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Күні</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{selectedDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Уақыты</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{selectedTime}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Адам саны</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{groupSize}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Жалпы сома</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}>{totalPrice.toLocaleString()} ₸</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade" style={{
              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
              animationDelay: '0.5s',
            }}>
              <span style={{ fontSize: '16px', color: '#16A34A', fontWeight: 600 }}>
                🌱 +{route.eco_bonus} Eco-bonus аласыз!
              </span>
            </div>
            
            <div className="animate-fade" style={{ display: 'flex', gap: '12px', animationDelay: '0.6s' }}>
              <Link href="/profile" style={{
                flex: 1,
                padding: '16px',
                borderRadius: '14px',
                border: '2px solid #E2E8F0',
                background: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A',
                textDecoration: 'none',
                textAlign: 'center',
              }}>
                Жеке кабинет
              </Link>
              <Link href="/routes" style={{
                flex: 1,
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
              }}>
                Басқа маршруттар
              </Link>
            </div>
          </div>
        </div>
      </>
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
            maxWidth: '1000px',
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
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                Брондау
              </span>
            </div>
            
            {/* Progress Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step >= s
                      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : '#E2E8F0',
                    color: step >= s ? '#fff' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div style={{
                      width: '40px',
                      height: '2px',
                      background: step > s ? '#22C55E' : '#E2E8F0',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>
        
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '40px',
        }}>
          {/* Main Form */}
          <div>
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  📅 Күн мен уақытты таңдаңыз
                </h2>
                <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
                  Саяхатқа барғыңыз келетін уақытты белгілеңіз
                </p>
                
                {/* Date */}
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                  marginBottom: '24px',
                }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>
                    Күнді таңдаңыз
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      border: '2px solid #E2E8F0',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                </div>
                
                {/* Time */}
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                  marginBottom: '24px',
                }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>
                    Бастау уақыты
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '15px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: selectedTime === time
                            ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                            : '#F1F5F9',
                          color: selectedTime === time ? '#fff' : '#475569',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Group Size */}
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>
                    Адам саны
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                      onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        background: '#fff',
                        fontSize: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', minWidth: '50px', textAlign: 'center' }}>
                      {groupSize}
                    </span>
                    <button
                      onClick={() => setGroupSize(Math.min(10, groupSize + 1))}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        background: '#fff',
                        fontSize: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontSize: '14px', color: '#64748B' }}>адам</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  👤 Байланыс ақпараты
                </h2>
                <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
                  Гид сізбен хабарласу үшін қажет
                </p>
                
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Аты-жөніңіз *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Мысалы: Арман Қасымов"
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Телефон нөмірі *
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+7 777 123 45 67"
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="email@example.com"
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Қосымша ақпарат
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Арнайы тілектеріңіз болса жазыңыз..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  💳 Төлем әдісі
                </h2>
                <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
                  Ыңғайлы төлем әдісін таңдаңыз
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { key: 'kaspi', label: 'Kaspi QR / Kaspi Gold', icon: '📱', desc: 'Kaspi арқылы төлеу' },
                    { key: 'card', label: 'Банк картасы', icon: '💳', desc: 'Visa, Mastercard' },
                    { key: 'cash', label: 'Қолма-қол', icon: '💵', desc: 'Гидке төлеу' },
                  ].map((method) => (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '24px',
                        borderRadius: '20px',
                        border: paymentMethod === method.key ? '2px solid #22C55E' : '2px solid #E2E8F0',
                        background: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: paymentMethod === method.key ? '0 4px 16px rgba(34, 197, 94, 0.2)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: paymentMethod === method.key
                          ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'
                          : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                      }}>
                        {method.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>{method.label}</div>
                        <div style={{ fontSize: '14px', color: '#64748B' }}>{method.desc}</div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: paymentMethod === method.key ? 'none' : '2px solid #E2E8F0',
                        background: paymentMethod === method.key
                          ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                          : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '14px',
                      }}>
                        {paymentMethod === method.key && '✓'}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Terms */}
                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: '#F8FAFC',
                  borderRadius: '16px',
                }}>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>
                    "Төлеу" батырмасын басу арқылы сіз{' '}
                    <span style={{ color: '#3B82F6', cursor: 'pointer' }}>қызмет көрсету шарттарын</span>{' '}
                    және{' '}
                    <span style={{ color: '#3B82F6', cursor: 'pointer' }}>құпиялылық саясатын</span>{' '}
                    қабылдайсыз.
                  </p>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
            }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '14px',
                    border: '2px solid #E2E8F0',
                    background: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  ← Артқа
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  Жалғастыру →
                </button>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={isProcessing}
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isProcessing
                      ? '#E2E8F0'
                      : 'linear-gradient(135deg, #22C55E, #16A34A)',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    color: '#fff',
                    boxShadow: isProcessing ? 'none' : '0 4px 16px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  {isProcessing ? '⏳ Өңделуде...' : `💳 Төлеу — ${totalPrice.toLocaleString()} ₸`}
                </button>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              position: 'sticky',
              top: '100px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>
                📋 Тапсырыс мәліметі
              </h3>
              
              {/* Route Info */}
              <div style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                }}>
                  🌲
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{route.name_kz}</div>
                  <div style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                    📏 {route.distance_km} км · ⏱️ {route.duration_hours} сағат
                  </div>
                </div>
              </div>
              
              {/* Guide Info */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                paddingBottom: '20px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {guide.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>{guide.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>⭐ {guide.rating} · {guide.price.toLocaleString()} ₸/адам/сағат</div>
                </div>
              </div>
              
              {/* Booking Details */}
              <div style={{ marginBottom: '20px' }}>
                {selectedDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748B', fontSize: '14px' }}>📅 Күні</span>
                    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{selectedDate}</span>
                  </div>
                )}
                {selectedTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#64748B', fontSize: '14px' }}>🕐 Уақыты</span>
                    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{selectedTime}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>👥 Адам саны</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{groupSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>⏱️ Ұзақтығы</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{route.duration_hours} сағат</span>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>
                    {guide.price.toLocaleString()} ₸ × {groupSize} адам × {route.duration_hours} сағат
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #E2E8F0',
                }}>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>Жалпы сома</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>
                    {totalPrice.toLocaleString()} ₸
                  </span>
                </div>
              </div>
              
              {/* Eco Bonus */}
              <div style={{
                background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '15px', color: '#16A34A', fontWeight: 600 }}>
                  🌱 +{route.eco_bonus} Eco-bonus аласыз!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
