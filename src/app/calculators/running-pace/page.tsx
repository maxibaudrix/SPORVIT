import { Metadata } from 'next';
import TrainingPaceCalculator from './TrainingPaceCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Ritmos de Entrenamiento Running | Zonas VDOT | Sporvit',
  description: 'Calcula tus ritmos de entrenamiento personalizados (Series, Umbral, Rodaje Suave) basándote en tu mejor marca reciente. Optimiza tu plan de running con rigor científico.',
  keywords: 'ritmos entrenamiento running, zonas entrenamiento carrera, calculadora vdot, ritmos series running, zonas intensidad carrera, entrenamiento maraton ritmos, jack daniels running',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-ritmo-de-entrenamiento-running' },
  openGraph: {
    title: 'Calculadora de Ritmos de Entrenamiento: Entrena con Inteligencia | Sporvit',
    description: 'Descubre tus zonas de intensidad exactas para rodajes, series y intervalos.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-ritmo-de-entrenamiento-running',
    type: 'website',
    images: [{ url: '/og-training-pace.jpg', width: 1200, height: 630, alt: 'Calculadora Ritmos Entrenamiento Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Ritmos de Entrenamiento Sporvit",
    "description": "Herramienta avanzada para determinar zonas de intensidad de carrera basadas en marcas de competición.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de ritmos Easy, Threshold, Interval y Repetition",
      "Basado en metodología VDOT de Jack Daniels",
      "Conversión automática por distancia de referencia",
      "Tabla de zonas detallada",
      "Código embed y compartir con resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrainingPaceCalculator />
    </>
  );
}