'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';

const LoginSchema = z.object({
  email: z.string().email('Email дұрыс емес'),
  password: z.string().min(1, 'Пароль енгізіңіз'),
});
type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPass, setShowPass] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerErr('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/map');
    } catch (err: any) {
      setServerErr(err.response?.data?.error || 'Кіру мүмкін болмады.');
    } finally {
      setLoading(false);
    }
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade { animation: fadeInUp 0.5s ease forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
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
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF9 100%)',
        }} className="lg:!flex">
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '2px solid rgba(34, 197, 94, 0.1)',
            top: '-150px',
            left: '-150px',
          }} />
          <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            border: '2px solid rgba(34, 197, 94, 0.08)',
            bottom: '-200px',
            right: '-200px',
          }} />
          
          <div style={{ textAlign: 'center', padding: '48px', position: 'relative', zIndex: 1 }}>
            <div className="animate-float" style={{
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
              🌿
            </div>
            
            <h2 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              Eco маршруттарды
              <br />
              <span style={{ color: '#16A34A' }}>Астанада</span> ашыңыз
            </h2>
            
            <p style={{
              fontSize: '17px',
              color: '#64748B',
              maxWidth: '400px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}>
              Жаяу серуен, велосипед, eco тур — CO₂ үнемдеп eco-bonus жинаңыз
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              {[
                { num: '25+', label: 'Маршрут', icon: '🗺️' },
                { num: '5000+', label: 'Турист', icon: '🧳' },
                { num: '12т', label: 'CO₂ үнемі', icon: '🌱' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '20px 28px',
                  borderRadius: '20px',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '2px solid #DCFCE7',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#16A34A' }}>{stat.num}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
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
            marginBottom: '40px',
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
              🌿
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
              Eco<span style={{ color: '#16A34A' }}>Route</span>
            </span>
          </Link>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '8px',
          }}>
            Қош келдіңіз! 👋
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '32px' }}>
            Eco маршруттарға қол жеткізу үшін кіріңіз
          </p>
          
          {/* Success message */}
          {registered && (
            <div style={{
              background: '#DCFCE7',
              border: '2px solid #86EFAC',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <span style={{ color: '#16A34A', fontWeight: 600 }}>
                Тіркелу сәтті! Енді кіре аласыз.
              </span>
            </div>
          )}
          
          {/* Error message */}
          {serverErr && (
            <div style={{
              background: '#FEF2F2',
              border: '2px solid #FECACA',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <span style={{ color: '#DC2626', fontWeight: 500 }}>{serverErr}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                {...register('email')}
                placeholder="arman@mail.kz"
                type="email"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: errors.email ? '2px solid #F87171' : '2px solid #E2E8F0',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#F8FAFC',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#22C55E'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#F87171' : '#E2E8F0'}
              />
              {errors.email && (
                <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '6px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px',
              }}>
                Құпия сөз
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '16px 52px 16px 20px',
                    borderRadius: '14px',
                    border: errors.password ? '2px solid #F87171' : '2px solid #E2E8F0',
                    fontSize: '16px',
                    outline: 'none',
                    background: '#F8FAFC',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#22C55E'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? '#F87171' : '#E2E8F0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#64748B',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '6px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>
            
            {/* Forgot password */}
            <div style={{ textAlign: 'right' }}>
              <Link href="/auth/forgot-password" style={{
                color: '#16A34A',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Құпия сөзді ұмыттыңыз ба?
              </Link>
            </div>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '14px',
                border: 'none',
                background: loading
                  ? '#BBF7D0'
                  : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: '#fff',
                fontSize: '17px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(34, 197, 94, 0.35)',
                transition: 'all 0.2s',
                marginTop: '8px',
              }}
            >
              {loading ? '⏳ Кіру...' : 'Кіру →'}
            </button>
          </form>
          
          <p style={{
            textAlign: 'center',
            color: '#64748B',
            fontSize: '15px',
            marginTop: '28px',
          }}>
            Аккаунт жоқ па?{' '}
            <Link href="/auth/register" style={{
              color: '#16A34A',
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Тіркелу
            </Link>
          </p>
          
          {/* Role selection */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
          }}>
            <Link href="/auth/register?role=tourist" style={{
              flex: 1,
              padding: '16px',
              borderRadius: '14px',
              border: '2px solid #E2E8F0',
              background: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>🧳</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Турист</span>
            </Link>
            <Link href="/auth/register?role=guide" style={{
              flex: 1,
              padding: '16px',
              borderRadius: '14px',
              border: '2px solid #E2E8F0',
              background: '#fff',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>🎯</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Гид</span>
            </Link>
          </div>
          
          {/* Test credentials */}
          <div style={{
            marginTop: '32px',
            padding: '16px 20px',
            borderRadius: '14px',
            background: '#F0FDF4',
            border: '2px solid #DCFCE7',
          }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '6px' }}>
              💡 Тест аккаунт:
            </p>
            <p style={{ color: '#16A34A', fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>
              arman@mail.kz / Test1234!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
