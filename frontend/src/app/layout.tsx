// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'EcoRoute Astana — Экологиялық маршруттар',
  description: 'Астананың ең үздік eco маршруттарын ашыңыз. Eco-bonus жинаңыз.',
  keywords: 'eco tourism, Astana, маршруттар, жасыл туризм, Қазақстан',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
