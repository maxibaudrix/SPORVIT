import { Metadata } from 'next';
import HarrisBenedictCalculator from './HarrisBenedictCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Calorías Harris-Benedict | TMB y TDEE | Sporvit',
  description: 'Calcula tu Tasa Metabólica Basal (TMB) y gasto energético total con la fórmula revisada de Harris-Benedict. Optimiza tu nutrición con precisión científica.',
  keywords: 'calculadora harris-benedict, tasa metabolica basal, TMB, TDEE, calcular calorias diarias, formula harris benedict revisada, gasto energetico basal',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-calorias-harris-benedict' },
  openGraph: {
    title: 'Calculadora Harris-Benedict: Tu Gasto Calórico Exacto | Sporvit',
    description: 'Descubre cuántas calorías quema tu cuerpo en reposo y según tu actividad física diaria.',
    url: 'https://sporvit.com/calculadoras/calculadora-calorias-harris-benedict',
    type: 'website',
    images: [{ url: '/og-harris-benedict.jpg', width: 1200, height: 630, alt: 'Calculadora Harris-Benedict Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora TMB Harris-Benedict | Sporvit',
    description: 'La herramienta definitiva para conocer tu metabolismo basal.',
    images: ['/og-harris-benedict.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Harris-Benedict Sporvit",
    "description": "Calculadora avanzada de Tasa Metabólica Basal (TMB) y Gasto Energético Total (TDEE) basada en la fórmula de Harris-Benedict revisada.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Cálculo de Tasa Metabólica Basal (TMB)",
      "Estimación de Gasto Energético Total (TDEE)",
      "Ajuste por niveles de actividad física",
      "Desglose por objetivos (Pérdida, Mantenimiento, Ganancia)",
      "Interfaz optimizada para móviles y accesible"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HarrisBenedictCalculator />
    </>
  );
}