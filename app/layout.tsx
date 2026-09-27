import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Homing Thistle | Architectural Living & Handcrafted Catalog',
    template: '%s | Homing Thistle',
  },
  description:
    'A curated showcase of architectural furniture, sculptural luminaires, and artisanal living objects designed for timeless interiors.',
  keywords: [
    'architectural furniture',
    'bespoke lighting',
    'minimalist catalog',
    'luxury interiors',
    'homing thistle',
    'handcrafted seating',
  ],
  authors: [{ name: 'Homing Thistle Studio' }],
  openGraph: {
    title: 'Homing Thistle | Architectural Living Objects',
    description:
      'Curated showcase of heirloom furniture, sculptural lighting, and handcrafted vessels.',
    url: 'https://homingthistle.com',
    siteName: 'Homing Thistle',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className={`${jakarta.className} min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-stone-900 selection:text-white antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
