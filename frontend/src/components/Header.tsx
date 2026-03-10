'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  showEcoBonus?: boolean;
}

export default function Header({ variant = 'default', showEcoBonus = true }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const userEcoBonus = 1250; // TODO: Get from user store
  
  const navLinks = [
    { href: '/routes', label: 'Маршруттар' },
    { href: '/guides', label: 'Гидтер' },
    { href: '/eco-actions', label: '♻️ Eco Actions' },
    { href: '/map', label: 'Карта' },
  ];
  
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: variant === 'transparent' 
        ? 'rgba(255, 255, 255, 0.95)' 
        : '#fff',
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
        {/* Logo */}
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
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
          }}>
            🌿
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Eco<span style={{ color: '#16A34A' }}>Route</span>
          </span>
        </Link>
        
        {/* Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive(link.href) ? 600 : 500,
                color: isActive(link.href) ? '#16A34A' : '#64748B',
                background: isActive(link.href) ? '#DCFCE7' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Eco Bonus */}
          {showEcoBonus && user && (
            <Link href="/eco-actions" style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
              border: '2px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '18px' }}>🌱</span>
              <span style={{ fontWeight: 700, color: '#16A34A' }}>{userEcoBonus}</span>
            </Link>
          )}
          
          {/* Auth Buttons / Profile */}
          {user ? (
            <Link href="/profile" style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              textDecoration: 'none',
              border: '2px solid #BAE6FD',
            }}>
              👤
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/auth/login" style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: '2px solid #E2E8F0',
                background: '#fff',
                color: '#0F172A',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
              }}>
                Кіру
              </Link>
              <Link href="/auth/register" style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
              }}>
                Тіркелу
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
