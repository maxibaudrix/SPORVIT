import { Metadata } from 'next';
import ACWRCalculator from './ACWRCalculator';

export const metadata: Metadata = {
  title: 'Calculadora ACWR | Prevención de Lesiones y Carga de Trabajo | Sporvit',
  description: 'Calcula tu Acute:Chronic Workload Ratio (ACWR). Gestiona tu carga de entrenamiento, evita lesiones por sobreesfuerzo y encuentra tu sweet spot de rendimiento.',
  keywords: 'calculadora acwr, ratio carga aguda cronica, prevencion lesiones deporte, sobreentrenamiento, gestion de carga, sweet spot entrenamiento, carga de trabajo deportiva',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-acwr-prevencion-lesiones' },
  openGraph: {
    title: 'Calculadora ACWR: Entrena Inteligente, No Más Fuerte | Sporvit',
    description: 'La herramienta definitiva para entrenadores y atletas para evitar lesiones por picos de carga.',
    url: 'https://sporvit.com/calculadoras/calculadora-acwr-prevencion-lesiones',
    type: 'website',
    images: [{ url: '/og-acwr.jpg', width: 1200, height: 630, alt: 'Calculadora ACWR Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora ACWR Sporvit",
    "description": "Algoritmo para la gestión de la carga de entrenamiento y prevención de lesiones basado en el ratio agudo-crónico.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de Carga Aguda (7 días)",
      "Cálculo de Carga Crónica (28 días)",
      "Identificación del Sweet Spot (0.8 - 1.3)",
      "Alertas de zona de peligro (> 1.5)"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ACWRCalculator />
    </>
  );
}