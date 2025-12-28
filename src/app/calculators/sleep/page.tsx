import { Metadata } from 'next';
import SleepCalculator from './SleepCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Sueño Óptimo | Ciclos de 90 Minutos | Sporvit',
  description: 'Calcula la hora ideal para dormir o despertar basándote en los ciclos biológicos del sueño. Optimiza tu recuperación muscular y claridad mental evitando la inercia del sueño.',
  keywords: 'calculadora de sueño, ciclos de sueño 90 minutos, a que hora despertar, higiene del sueño, sueño rem, recuperacion muscular sueño, dormir mejor fitness',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-sueno-optimo' },
  openGraph: {
    title: 'Calculadora de Sueño Óptimo: Descansa como un Atleta | Sporvit',
    description: 'Ajusta tu descanso a tus ritmos circadianos y despierta con máxima energía.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-sueno-optimo',
    type: 'website',
    images: [{ url: '/og-sleep.jpg', width: 1200, height: 630, alt: 'Calculadora de Sueño Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Sueño Sporvit",
    "description": "Herramienta basada en neurociencia para el cálculo de ciclos de sueño óptimos y tiempos de descanso.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo por ciclos de 90 minutos",
      "Estimación de tiempo de conciliación (14 min)",
      "Recomendaciones de recuperación física y cognitiva",
      "Interfaz adaptable para móvil",
      "Compartir resultados de descanso"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SleepCalculator />
    </>
  );
}