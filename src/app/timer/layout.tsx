// src/app/timer/layout.tsx
import { Metadata } from 'next';
import { Header } from '@/components/ui/layout/public/Header';
import { AppFooter } from '@/components/ui/layout/dashboard/AppFooter';

export const metadata: Metadata = {
  title: 'Cronómetro de Entrenamiento HIIT, Tabata & AMRAP | Sporvit',
  description: 'Temporizador fitness profesional con modos HIIT, Tabata, EMOM y AMRAP. Mantén la pantalla activa, sonidos personalizables y sin anuncios. Gratis.',
  keywords: 'cronometro entrenamiento, timer HIIT, tabata timer, temporizador fitness, AMRAP timer, EMOM timer, cronometro gym',
  
  openGraph: {
    title: 'Cronómetro de Entrenamiento Profesional | Sporvit',
    description: 'Timer fitness con Wake Lock, sonidos y modos HIIT, Tabata, EMOM. Perfecto para el gym.',
    images: ['/og-timer.png'],
    type: 'website',
    locale: 'es_ES',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Timer Fitness Profesional',
    description: 'Cronómetro HIIT, Tabata y más - Gratis',
    images: ['/og-timer.png'],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: 'https://sporvit.com/timer',
  },
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schema.org para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sporvit Timer",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "operatingSystem": "Web Browser",
            "description": "Temporizador profesional para entrenamientos HIIT, Tabata, EMOM y AMRAP"
          })
        }}
      />

      {/* Breadcrumbs estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://sporvit.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Dashboard",
                "item": "https://sporvit.com/dashboard"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Cronómetro",
                "item": "https://sporvit.com/timer"
              }
            ]
          })
        }}
      />

      {/* Header */}
      <Header />
      
      {/* Main content con padding para no superponerse */}
      <main className="pt-20 pb-16">
        {children}
      </main>
      
      {/* Footer */}
      <AppFooter/>
    </>
  );
}