import { Metadata } from 'next';
import WaterIntakeCalculator from './WaterIntakeCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Consumo de Agua Diario | Hidratación Óptima | Sporvit',
  description: 'Calcula cuánta agua debes beber al día según tu peso, nivel de actividad y clima. Optimiza tu rendimiento y salud con una hidratación personalizada.',
  keywords: 'calculadora de agua diaria, cuánta agua beber al día, hidratación deportiva, consumo de agua por peso, salud renal, rendimiento físico agua',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-consumo-de-agua-diario' },
  openGraph: {
    title: 'Calculadora de Consumo de Agua: Tu Hidratación Ideal | Sporvit',
    description: 'Descubre tu requerimiento hídrico diario con precisión científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-consumo-de-agua-diario',
    type: 'website',
    images: [{ url: '/og-water.jpg', width: 1200, height: 630, alt: 'Calculadora de Agua Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Consumo de Agua Diario | Sporvit',
    description: 'Calcula tu hidratación óptima en segundos.',
    images: ['/og-water.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Consumo de Agua Sporvit",
    "description": "Herramienta avanzada para calcular el requerimiento hídrico diario basado en peso, ejercicio y factores ambientales.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cálculo por peso corporal (35ml/kg)",
      "Ajuste por minutos de ejercicio intenso",
      "Compensación por climas cálidos",
      "Conversión a vasos de agua (250ml)",
      "Interfaz accesible y optimizada para SEO"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WaterIntakeCalculator />
    </>
  );
}