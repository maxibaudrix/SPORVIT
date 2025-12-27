import { Metadata } from 'next';
import TargetHeartRateCalculator from './TargetHeartRateCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Frecuencia Cardíaca Objetivo | Método Karvonen | Sporvit',
  description: 'Calcula tus zonas de entrenamiento y frecuencia cardíaca objetivo con la fórmula de Karvonen. Optimiza tu rendimiento aeróbico y quema de grasa.',
  keywords: 'calculadora frecuencia cardíaca objetivo, fórmula karvonen, zonas de entrenamiento, frecuencia cardíaca máxima, frecuencia cardíaca en reposo, entrenamiento cardio, pulsaciones objetivo',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-frecuencia-cardiaca-objetivo' },
  openGraph: {
    title: 'Calculadora de Frecuencia Cardíaca Objetivo: Entrena con Precisión | Sporvit',
    description: 'Descubre tus rangos de pulsaciones ideales para cada tipo de entrenamiento mediante el método Karvonen.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-frecuencia-cardiaca-objetivo',
    type: 'website',
    images: [{ url: '/og-thr.jpg', width: 1200, height: 630, alt: 'Calculadora de FC Objetivo Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zonas de Frecuencia Cardíaca Objetivo | Sporvit',
    description: 'Calcula tus zonas de intensidad cardiovascular con rigor científico.',
    images: ['/og-thr.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Frecuencia Cardíaca Objetivo Sporvit",
    "description": "Herramienta avanzada para calcular zonas de entrenamiento basadas en la frecuencia cardíaca de reserva y el método Karvonen.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cálculo de Frecuencia Cardíaca Máxima (MHR)",
      "Cálculo de Frecuencia Cardíaca de Reserva (HRR)",
      "Zonas de entrenamiento personalizadas (50% - 100%)",
      "Interfaz accesible y mobile-first",
      "Contenido educativo optimizado para SEO"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TargetHeartRateCalculator />
    </>
  );
}