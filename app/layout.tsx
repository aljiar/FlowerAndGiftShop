import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { site } from '@/lib/constants';

const inter = localFont({
  src: [
    { path: '../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2', weight: '500' },
    { path: '../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2', weight: '600' },
    { path: '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2', weight: '700' }
  ],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = localFont({
  src: [
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2', weight: '500' },
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2', weight: '600' },
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2', weight: '700' },
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2', weight: '400', style: 'italic' }
  ],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Florería de autor en ${site.city}`,
    template: `%s · ${site.name}`
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Florería de autor en ${site.city}`,
    description: site.description
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' }
};

export const viewport: Viewport = {
  themeColor: '#FBF7F2',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-BO" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <TopBar />
        <Header />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
