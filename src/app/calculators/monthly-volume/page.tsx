import { Metadata } from 'next';
import MonthlyVolumeCalculator from './MonthlyVolumeCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Volumen de Entrenamiento Mensual | Tonelaje Total | Sporvit',
  description: 'Calcula tu volumen de entrenamiento mensual acumulado. Proyecta y mide tu tonelaje total para maximizar la hipertrofia y la fuerza a largo plazo.',
  keywords: 'volumen entrenamiento mensual, calcular tonelaje mensual, carga de trabajo gimnasio, planificacion deportiva, hipertrofia mesociclo, progreso fitness',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-volumen-de-entrenamiento-mensual' },
  openGraph: {
    title: 'Calculadora de Volumen Mensual: Planifica tu Éxito | Sporvit',
    description: 'Mide la carga total de tu mesociclo y asegura la sobrecarga progresiva.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-volumen-de-entrenamiento-mensual',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Volumen Mensual Sporvit",
    "description": "Herramienta avanzada para cuantificar el tonelaje total acumulado durante un mes de entrenamiento.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Lista de ejercicios predefinidos por grupos musculares",
      "Cálculo de Tonelaje Mensual (Series x Reps x Carga x Frecuencia)",
      "Proyección de carga por mesociclo",
      "Código embed funcional",
      "Compartir resultados detallados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MonthlyVolumeCalculator />
    </>
  );
}