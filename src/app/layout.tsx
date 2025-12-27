// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner'; // npm install sonner

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sporvit.com'),
  title: {
    default: 'Sporvit - Tu Coach Fitness Personal con IA',
    template: '%s | Sporvit'
  },
  description: 'Plataforma completa de fitness con IA: planes de entrenamiento personalizados, seguimiento nutricional, cronómetro profesional y más.',
  keywords: ['fitness', 'entrenamiento', 'nutrición', 'IA', 'cronómetro', 'HIIT', 'Tabata', 'gym', 'sporvit'],
  authors: [{ name: 'Sporvit' }],
  creator: 'Sporvit',
  publisher: 'Sporvit',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://sporvit.com',
    siteName: 'Sporvit',
    title: 'Sporvit - Tu Coach Fitness Personal con IA',
    description: 'Transforma tu físico con planes personalizados de entrenamiento y nutrición',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sporvit - Fitness con IA',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sporvit - Fitness con IA',
    description: 'Planes personalizados de entrenamiento y nutrición',
    creator: '@sporvit',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sporvit',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#10b981' },
  ],
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sporvit" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#10b981" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {/* Toast notifications */}
        <Toaster 
          position="top-center"
          theme="dark"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}