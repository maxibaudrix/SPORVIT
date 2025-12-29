import { Metadata } from 'next';
import TaperingCalculator from './TaperingCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Tapering Training | Planifica tu Pico de Forma | Sporvit',
  description: 'Optimiza tu rendimiento pre-competición con nuestra calculadora de tapering. Reduce el volumen, mantén la intensidad y llega al día de la carrera en tu máximo nivel.',
  keywords: 'tapering entrenamiento, reduccion de carga precompeticion, pico de forma deportiva, supercompensacion, tapering maraton, tapering triatlon, planificacion deportiva',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-tapering-training' },
  openGraph: {
    title: 'Calculadora de Tapering: Tu Pasaporte al Récord Personal | Sporvit',
    description: 'Calcula cómo reducir tu volumen de entrenamiento antes de la gran cita.',
    url: 'https://sporvit.com/calculadoras/calculadora-tapering-training',
    type: 'website',
    images: [{ url: '/og-tapering.jpg', width: 1200, height: 630, alt: 'Calculadora Tapering Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Tapering Sporvit",
    "description": "Herramienta avanzada para calcular la reducción de carga pre-competición basada en principios de supercompensación.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Modelo de reducción de volumen exponencial",
      "Mantenimiento de intensidad específica",
      "Planificación de 2 y 3 semanas",
      "Interfaz mobile-first",
      "Compartir resultados detallados de carga"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TaperingCalculator />
    </>
  );
}