import { Metadata } from 'next';
import SupplementCalculator from './SupplementCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Dosis de Suplementación Deportiva | Sporvit',
  description: 'Calcula la dosis exacta de creatina, cafeína y beta-alanina según tu peso corporal. Basado en protocolos científicos de nutrición deportiva avanzada.',
  keywords: 'dosis creatina por peso, cafeina pre-entreno dosis, calcular beta-alanina, suplementacion deportiva evidencia, nutricion elite, ayudas ergogenicas',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-dosis-suplementacion-deportiva' },
  openGraph: {
    title: 'Suplementación de Precisión: Dosis por Peso Corporal | Sporvit',
    description: 'Optimiza tu rendimiento con las dosis exactas de los suplementos con mayor evidencia científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-dosis-suplementacion-deportiva',
    type: 'website',
    images: [{ url: '/og-supplements.jpg', width: 1200, height: 630, alt: 'Suplementación Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Suplementación Sporvit",
    "description": "Herramienta para el cálculo personalizado de dosis de ayudas ergogénicas basada en la masa corporal.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Dosis de Creatina Monohidrato (0.1g/kg)",
      "Rango de Cafeína para rendimiento (3-6mg/kg)",
      "Protocolo de Beta-Alanina y Bicarbonato",
      "Interfaz técnica para atletas y preparadores"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SupplementCalculator />
    </>
  );
}