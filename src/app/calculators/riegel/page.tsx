import { Metadata } from 'next';
import RiegelPredictor from './RiegelPredictor';

export const metadata: Metadata = {
  title: 'Calculadora de Predicción de Tiempos de Carrera | Fórmula de Riegel | Sporvit',
  description: 'Predice tu tiempo en Maratón, Media Maratón o 10K basado en tus marcas actuales. Utiliza la fórmula de Riegel para planificar tus ritmos de competición con precisión.',
  keywords: 'prediccion tiempos carrera, formula de riegel, calcular tiempo maraton, ritmos competicion running, estimador tiempos running, vaticinador carreras, running endurance',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculador-prediccion-tiempos-riegel' },
  openGraph: {
    title: 'Fórmula de Riegel: Predice tu Próxima Marca Personal | Sporvit',
    description: '¿Cuánto harías en un Maratón según tu tiempo de 10K? Descúbrelo con nuestra calculadora científica.',
    url: 'https://sporvit.com/calculadoras/calculador-prediccion-tiempos-riegel',
    type: 'website',
    images: [{ url: '/og-riegel.jpg', width: 1200, height: 630, alt: 'Calculadora Riegel Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Predictor de Tiempos Riegel Sporvit",
    "description": "Herramienta de estimación de rendimiento para corredores de fondo basada en la ecuación de Peter Riegel.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Predicción para Maratón y Media Maratón",
      "Conversión automática de ritmos (min/km)",
      "Cálculo basado en la fórmula original de Riegel (1.06)",
      "Interfaz optimizada para corredores"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RiegelPredictor />
    </>
  );
}