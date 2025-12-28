import { Metadata } from 'next';
import LBMCalculator from './LBMCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Masa Corporal Magra (LBM) | Peso Magro | Sporvit',
  description: 'Calcula tu Masa Corporal Magra (LBM) con precisión. Descubre cuánto pesa tu músculo, órganos y huesos para optimizar tu entrenamiento y dieta.',
  keywords: 'calculadora LBM, masa corporal magra, peso magro, calcular masa muscular, formula de boer, composicion corporal, indice masa magra',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-masa-corporal-magra-lbm' },
  openGraph: {
    title: 'Calculadora de Masa Corporal Magra (LBM) | Sporvit',
    description: '¿Cuánto de tu peso es músculo real? Mide tu masa magra con rigor científico.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-masa-corporal-magra-lbm',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de LBM Sporvit",
    "description": "Herramienta avanzada para determinar la masa corporal magra basada en variables antropométricas.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo por fórmula de Boer",
      "Diferenciación por sexo biológico",
      "Cálculo de porcentaje de masa magra",
      "Interfaz accesible y mobile-first",
      "Botones de compartir con resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LBMCalculator />
    </>
  );
}