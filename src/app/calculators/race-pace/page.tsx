import { Metadata } from 'next';
import RacePaceCalculator from './RacePaceCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Ritmo de Carrera | Pace Running | Sporvit',
  description: 'Calcula tu ritmo por kilómetro, tiempo de llegada o distancia de carrera. Herramienta precisa para corredores de 5K, 10K, Media Maratón y Maratón.',
  keywords: 'calculadora ritmo carrera, pace running, ritmo por km, tiempo maraton, predecir tiempo carrera, calculadora running, splits carrera',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-ritmo-de-carrera' },
  openGraph: {
    title: 'Calculadora de Ritmo de Carrera: Optimiza tu Marca | Sporvit',
    description: 'Calcula tus ritmos de entrenamiento y competición con precisión de segundos.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-ritmo-de-carrera',
    type: 'website',
    images: [{ url: '/og-running-pace.jpg', width: 1200, height: 630, alt: 'Calculadora Running Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Ritmo de Carrera Sporvit",
    "description": "Calculadora avanzada para corredores que determina ritmo, tiempo y distancia con tabla de parciales.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de ritmo por km (Pace)",
      "Predicción de tiempo final",
      "Tabla de splits/parciales automática",
      "Distancias predefinidas (Maratón, Media, 10K, 5K)",
      "Código embed y compartir resultados detallados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RacePaceCalculator />
    </>
  );
}