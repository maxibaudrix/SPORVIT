import { Metadata } from 'next';
import BodyFatCalculator from './BodyFatCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Porcentaje de Grasa Corporal (PGC) | Método Navy | Sporvit',
  description: 'Calcula tu porcentaje de grasa corporal de forma precisa con el método de la Marina de EE. UU. Mide tu progreso real más allá de la báscula.',
  keywords: 'porcentaje grasa corporal, calcular pgc, metodo navy grasa, indice grasa corporal, medir grasa con cinta, fitness y salud, composicion corporal',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-porcentaje-de-grasa-corporal' },
  openGraph: {
    title: 'Calculadora de Grasa Corporal: Tu Composición Real | Sporvit',
    description: 'Descubre cuánta grasa tienes realmente con precisión científica y medidas de cinta.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-porcentaje-de-grasa-corporal',
    type: 'website',
    images: [{ url: '/og-body-fat.jpg', width: 1200, height: 630, alt: 'Calculadora Grasa Corporal Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Grasa Corporal Sporvit",
    "description": "Herramienta para estimar el porcentaje de grasa corporal mediante perímetros corporales y método Navy.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Algoritmo Navy Method (Marina EE.UU.)",
      "Clasificación por categorías de salud (ACE)",
      "Cálculo de masa magra y masa grasa en kg",
      "Interfaz adaptable y profesional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BodyFatCalculator />
    </>
  );
}