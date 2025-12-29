import { Metadata } from 'next';
import HRZonesCalculator from './HRZonesCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Zonas de Frecuencia Cardíaca | Método Karvonen | Sporvit',
  description: 'Calcula tus zonas de entrenamiento cardiovascular (Z1-Z5) con precisión. Método Karvonen basado en frecuencia cardíaca en reposo y máxima.',
  keywords: 'zonas frecuencia cardiaca, calcular zonas entrenamiento, metodo karvonen, quemar grasa pulsaciones, zona 2 cardio, umbral lactato, fc maxina',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-zonas-de-frecuencia-cardiaca' },
  openGraph: {
    title: 'Calculadora de Zonas de FC: Entrena con Inteligencia | Sporvit',
    description: 'Descubre tus rangos exactos de pulsaciones para quemar grasa o mejorar tu VO2 máx.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-zonas-de-frecuencia-cardiaca',
    type: 'website',
    images: [{ url: '/og-hr-zones.jpg', width: 1200, height: 630, alt: 'Zonas de FC Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Zonas de FC Sporvit",
    "description": "Herramienta avanzada para calcular zonas de entrenamiento cardiovascular mediante el método Karvonen.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo por Método Karvonen",
      "5 zonas de intensidad detalladas",
      "Ajuste por FC en Reposo",
      "Código embed y compartir resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HRZonesCalculator />
    </>
  );
}