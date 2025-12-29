import { Metadata } from 'next';
import MuscleVolumeCalculator from './MuscleVolumeCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Volumen por Grupo Muscular | Series Semanales | Sporvit',
  description: 'Audita tu volumen de entrenamiento semanal. Calcula las series efectivas por grupo muscular para optimizar la hipertrofia y evitar el sobreentrenamiento.',
  keywords: 'volumen entrenamiento hipertrofia, series efectivas por semana, calculadora volumen muscular, entrenamiento culturismo, volumen de mantenimiento, sobreentrenamiento',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-volumen-por-grupo-muscular' },
  openGraph: {
    title: 'Calculadora de Volumen Muscular: Optimiza tu Hipertrofia | Sporvit',
    description: '¿Estás haciendo demasiadas series o te quedas corto? Descubre tu volumen óptimo por grupo muscular.',
    url: 'https://sporvit.com/calculadoras/calculadora-volumen-por-grupo-muscular',
    type: 'website',
    images: [{ url: '/og-muscle-volume.jpg', width: 1200, height: 630, alt: 'Volumen Muscular Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Volumen Muscular Sporvit",
    "description": "Herramienta técnica para el conteo de series efectivas semanales por grupo muscular según evidencia científica.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Conteo de series por 10 grupos musculares",
      "Clasificación: Mantenimiento, Volumen Efectivo o Riesgo",
      "Interfaz optimizada para entrenadores de gimnasio",
      "Análisis de equilibrio muscular"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MuscleVolumeCalculator />
    </>
  );
}