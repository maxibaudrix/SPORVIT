import { Metadata } from 'next';
import CSSCalculator from './CSSCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Velocidad Crítica de Nado (CSS) | Sporvit',
  description: 'Calcula tu Velocidad Crítica de Nado (CSS). Determina tu umbral anaeróbico en natación para planificar tus ritmos de entrenamiento y mejorar en triatlón.',
  keywords: 'calculadora CSS natacion, velocidad critica nado, umbral anaerobico natacion, ritmo 100m natacion, test 400 200 natacion, entrenamiento triatlon nado',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-velocidad-critica-de-nado-css' },
  openGraph: {
    title: 'Calculadora CSS: Domina tu Ritmo en el Agua | Sporvit',
    description: 'Descubre tu umbral de nado y entrena con precisión científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-velocidad-critica-de-nado-css',
    type: 'website',
    images: [{ url: '/og-css-swim.jpg', width: 1200, height: 630, alt: 'Calculadora CSS Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora CSS Natación Sporvit",
    "description": "Calculadora de Velocidad Crítica de Nado basada en tiempos de test de 400 y 200 metros.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de ritmo CSS por 100m",
      "Desglose de zonas de entrenamiento (Endurance, Threshold, Sprint)",
      "Basado en la fórmula científica de Ginn",
      "Interfaz accesible y optimizada",
      "Código embebible profesional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CSSCalculator />
    </>
  );
}