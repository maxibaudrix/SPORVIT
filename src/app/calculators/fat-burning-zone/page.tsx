import { Metadata } from 'next';
import FatBurnZoneCalculator from './FatBurnZoneCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de la Zona de Quema de Grasas | Cardio de Precisión | Sporvit',
  description: 'Calcula tus pulsaciones ideales para quemar grasa. Descubre tu Zona 2 de entrenamiento basándote en tu frecuencia cardíaca en reposo y edad.',
  keywords: 'zona quema grasas, calcular zona 2 cardio, pulsaciones perder peso, fat burn zone, formula karvonen grasa, adelgazar corriendo pulsaciones',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-la-zona-de-quema-de-grasas-2' },
  openGraph: {
    title: 'Zona de Quema de Grasas: ¿A qué pulsaciones entrenar? | Sporvit',
    description: 'Optimiza tu cardio para metabolizar grasas de forma eficiente.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-la-zona-de-quema-de-grasas-2',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Zona Quema Grasas Sporvit",
    "description": "Calculadora de zonas de entrenamiento específicas para la oxidación de lípidos.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo de Zona 2 (60-70% HRR)",
      "Método Karvonen avanzado",
      "Indicador de pulsaciones por minuto (BPM)",
      "Contenido educativo sobre metabolismo de grasas",
      "Interfaz mobile-friendly y código embed"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FatBurnZoneCalculator />
    </>
  );
}