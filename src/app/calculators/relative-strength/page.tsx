import { Metadata } from 'next';
import RelativeStrengthCalculator from './RelativeStrengthCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Fuerza Relativa | Ratio y Coeficiente Wilks | Sporvit',
  description: 'Calcula tu fuerza relativa y coeficiente Wilks. Compara tu rendimiento real en levantamientos como sentadilla, press banca o peso muerto sin importar tu peso corporal.',
  keywords: 'calculadora fuerza relativa, coeficiente wilks, ratio de fuerza, fuerza absoluta vs relativa, powerlifting calculator, comparar fuerza por peso',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-fuerza-relativa' },
  openGraph: {
    title: 'Calculadora de Fuerza Relativa y Wilks | Sporvit',
    description: '¿Eres realmente fuerte? Mide tu fuerza proporcional a tu masa corporal.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-fuerza-relativa',
    type: 'website',
    images: [{ url: '/og-strength.jpg', width: 1200, height: 630, alt: 'Calculadora de Fuerza Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Fuerza Relativa Sporvit",
    "description": "Analizador de rendimiento de fuerza basado en peso corporal y carga levantada mediante ratios y Wilks.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo de Ratio de Fuerza (Lifts/BW)",
      "Estimación de Coeficiente Wilks",
      "Clasificación de nivel de fuerza",
      "Código embed optimizado",
      "Accesibilidad A11Y avanzada"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RelativeStrengthCalculator />
    </>
  );
}