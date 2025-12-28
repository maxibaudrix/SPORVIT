import { Metadata } from 'next';
import TrainingVolumeCalculator from './TrainingVolumeCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Volumen de Entrenamiento Semanal | Tonelaje | Sporvit',
  description: 'Calcula tu volumen de entrenamiento (tonelaje total) seleccionando ejercicios específicos. Optimiza la hipertrofia y la sobrecarga progresiva con datos reales.',
  keywords: 'calculadora volumen entrenamiento, tonelaje semanal, ejercicios gimnasio, sobrecarga progresiva, volumen hipertrofia, series y repeticiones, carga de entrenamiento',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-volumen-de-entrenamiento-semanal' },
  openGraph: {
    title: 'Calculadora de Volumen de Entrenamiento: Mide tu Progreso | Sporvit',
    description: 'Cuantifica tu esfuerzo semanal con nuestra lista de ejercicios predefinidos.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-volumen-de-entrenamiento-semanal',
    type: 'website',
    images: [{ url: '/og-volume.jpg', width: 1200, height: 630, alt: 'Calculadora Volumen Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Volumen de Entrenamiento Sporvit",
    "description": "Herramienta para calcular el tonelaje total basada en una lista de ejercicios predefinidos por grupos musculares.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Lista de ejercicios predefinidos por categorías",
      "Cálculo de Tonelaje Total (Series x Reps x Carga)",
      "Gestión dinámica de ejercicios",
      "Código embed para sitios web",
      "Compartir resultados en redes sociales"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrainingVolumeCalculator />
    </>
  );
}