import { Metadata } from 'next';
import RunningPlanGenerator from './RunningPlanGenerator';

export const metadata: Metadata = {
  title: 'Generador de Plan de Entrenamiento Running | 5K a Maratón | Sporvit',
  description: 'Crea tu plan de entrenamiento de running personalizado en segundos. Rutinas para 5K, 10K, Media Maratón y Maratón adaptadas a tu nivel actual.',
  keywords: 'plan entrenamiento running, rutina correr 5k, preparar maraton, entrenamiento 10k personalizado, plan running principiantes, periodización carrera, coach running online',
  alternates: { canonical: 'https://sporvit.com/calculadoras/plan-de-entrenamiento-running' },
  openGraph: {
    title: 'Generador de Planes de Running Sporvit: Tu Camino al Récord',
    description: 'Diseña tu temporada de running con rigor científico y progresión lógica.',
    url: 'https://sporvit.com/calculadoras/plan-de-entrenamiento-running',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Generador de Planes de Running Sporvit",
    "description": "Herramienta avanzada para la creación automática de planes de entrenamiento de carrera a pie basados en objetivos y nivel de forma.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Generación de 4 a 12 semanas de entrenamiento",
      "Adaptación por niveles: Principiante, Intermedio, Avanzado",
      "Distancias: 5K, 10K, 21K y 42K",
      "Desglose de tipos de sesión (Series, Tempo, Rodaje)",
      "Botones de exportación y compartir"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RunningPlanGenerator />
    </>
  );
}