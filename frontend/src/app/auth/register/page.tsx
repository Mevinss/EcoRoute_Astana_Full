'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Аты-жөніңізді енгізіңіз'),
  email: z.string().email('Email дұрыс емес'),
  phone: z.string().min(10, 'Телефон нөмірі дұрыс емес'),
  password: z.string().min(8, 'Кем дегенде 8 символ'),
  confirmPassword: z.string(),
  experience: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Құпия сөздер сәйкес келмейді',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof RegisterSchema>;

const REGIONS = [
  { id: 'green_belt', name: '🌲 Жасыл белдеу (Астана)' },
  { id: 'burabay', name: '🏔️ Бурабай' },
  { id: 'korgalzhyn', name: '🦩 Қорғалжын' },
];

const LANGUAGES = [
  { id: 'kz', name: '🇰🇿 Қазақша' },
  { id: 'ru', name: '🇷🇺 Русский' },
  { id: 'en', name: '🇬🇧 English' },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'tourist';
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['kz']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const totalSteps = role === 'guide' ? 3 : 2;

  const nextStep = async () => {
    const fieldsToValidate = step === 1
      ? ['name', 'email', 'phone'] as const
      : step === 2
        ? ['password', 'confirmPassword'] as const
        : [];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setServerErr('');
    setLoading(true);
    try {
      const payload = {
        ...data,
        role,
        regions: selectedRegions,
        languages: selectedLanguages,
      };
      await api.post('/auth/register', payload);
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setServerErr(err.response?.data?.error || 'Тіркелу мүмкін болмады.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRegion = (id: string) => {
    setSelectedRegions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (id: string) => {
    setSelectedLanguages(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: hasError ? '2px solid #F87171' : '2px solid #BBF7D0',
    background: '#F0FDF4',
    color: '#14532D',
    fontSize: '15px',
    outline: 'none',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#14532D',
    marginBottom: '8px',
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fadeInUp 0.5s ease forwards; }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 50%, #ECFDF5 100%)',
      }}>
        {/* LEFT — Hero Panel */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 100%)',
          display: 'none',
        }} className="lg:!flex">
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '2px solid rgba(34, 197, 94, 0.1)',
            top: '-150px',
            left: '-150px',
          }} />
          
          <div style={{ textAlign: 'center', padding: '48px', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              margin: '0 auto 32px',
              boxShadow: '0 16px 48px rgba(34, 197, 94, 0.35)',
            }}>
              {role === 'guide' ? '🎯' : '🧳'}
            </div>
            
            <h2 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              {role === 'guide' ? (
                <><span style={{ color: '#16A34A' }}>Гид</span> бол,<br />табиғатты көрсет!</>
              ) : (
                <>Табиғатты<br /><span style={{ color: '#16A34A' }}>ашуға</span> дайынсың ба?</>
              )}
            </h2>
            
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
              {role === 'guide' ? 'Тәжірибеңізді бөлісіп, табыс табыңыз' : 'Eco-bonus жина, маршруттарды аш'}
            </p>
          </div>
        </div>
        
        {/* RIGHT — Form */}
        <div style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 40px',
          background: '#fff',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            textDecoration: 'none',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              {role === 'guide' ? '🎯' : '🧳'}
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              Eco<span style={{ color: '#16A34A' }}>Route</span>
            </span>
          </Link>
          
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            {role === 'guide' ? 'Гид тіркелу 🎯' : 'Турист тіркелу 🧳'}
          </h1>
          
          {/* Progress bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#16A34A' }}>
                Қадам {step}/{totalSteps}
              </span>
              <span style={{ fontSize: '14px', color: '#64748B' }}>
                {step === 1 && 'Жеке мәліметтер'}
                {step === 2 && 'Құпия сөз'}
                {step === 3 && 'Гид ақпараты'}
              </span>
            </div>
            <div style={{ height: '8px', background: '#DCFCE7', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: (step / totalSteps * 100) + '%',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                borderRadius: '4px',
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {serverErr && (
            <div style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              ⚠️ {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal info */}
            {step === 1 && (
              <div className="animate-fade">
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#14532D', marginBottom: '20px' }}>
                  👤 Жеке мәліметтер
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Аты-жөні</label>
                  <input {...register('name')} placeholder="Арман Қасымов" style={getInputStyle(!!errors.name)} />
                  {errors.name && <p style={{ marginTop: '6px', fontSize: '13px', color: '#EF4444' }}>{errors.name.message}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email</label>
                  <input {...register('email')} type="email" placeholder="email@example.com" style={getInputStyle(!!errors.email)} />
                  {errors.email && <p style={{ marginTop: '6px', fontSize: '13px', color: '#EF4444' }}>{errors.email.message}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Телефон</label>
                  <input {...register('phone')} placeholder="+7 777 123 45 67" style={getInputStyle(!!errors.phone)} />
                  {errors.phone && <p style={{ marginTop: '6px', fontSize: '13px', color: '#EF4444' }}>{errors.phone.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="animate-fade">
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#14532D', marginBottom: '20px' }}>
                  🔐 Құпия сөз
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Құпия сөз</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      {...register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="Кем дегенде 8 символ"
                      style={{ ...getInputStyle(!!errors.password), paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                      }}
                    >
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p style={{ marginTop: '6px', fontSize: '13px', color: '#EF4444' }}>{errors.password.message}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Құпия сөзді қайталаңыз</label>
                  <input {...register('confirmPassword')} type="password" placeholder="••••••••" style={getInputStyle(!!errors.confirmPassword)} />
                  {errors.confirmPassword && <p style={{ marginTop: '6px', fontSize: '13px', color: '#EF4444' }}>{errors.confirmPassword.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Guide info */}
            {step === 3 && role === 'guide' && (
              <div className="animate-fade">
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#14532D', marginBottom: '20px' }}>
                  🎯 Гид ақпараты
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Тәжірибе</label>
                  <select {...register('experience')} style={{ ...getInputStyle(false), cursor: 'pointer' }}>
                    <option value="">Таңдаңыз</option>
                    <option value="1-3">1-3 жыл</option>
                    <option value="3-5">3-5 жыл</option>
                    <option value="5+">5+ жыл</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Аймақтар</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {REGIONS.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => toggleRegion(region.id)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: selectedRegions.includes(region.id) ? '2px solid #22C55E' : '2px solid #BBF7D0',
                          background: selectedRegions.includes(region.id) ? '#DCFCE7' : '#F0FDF4',
                          color: '#14532D',
                          fontSize: '15px',
                          fontWeight: 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        {region.name}
                        {selectedRegions.includes(region.id) && <span style={{ color: '#16A34A' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Тілдер</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => toggleLanguage(lang.id)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          background: selectedLanguages.includes(lang.id)
                            ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                            : '#F0FDF4',
                          color: selectedLanguages.includes(lang.id) ? '#fff' : '#14532D',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Өзіңіз туралы</label>
                  <textarea
                    {...register('bio')}
                    rows={3}
                    placeholder="Тәжірибеңіз, қызығушылықтарыңыз туралы..."
                    style={{ ...getInputStyle(false), resize: 'none', minHeight: '100px' }}
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '14px',
                    border: '2px solid #86EFAC',
                    background: '#fff',
                    color: '#16A34A',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ← Артқа
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                  }}
                >
                  Келесі →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #22C55E, #16A34A)',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 8px 24px rgba(34, 197, 94, 0.35)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? '⏳ Тіркелу...' : role === 'guide' ? '🎯 Гид болу' : '✅ Тіркелу'}
                </button>
              )}
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748B', fontSize: '15px' }}>
            Аккаунтыңыз бар ма?{' '}
            <Link href="/auth/login" style={{ color: '#16A34A', fontWeight: 700, textDecoration: 'none' }}>
              Кіру
            </Link>
          </p>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href="/landing" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>
              ← Басты бетке оралу
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
