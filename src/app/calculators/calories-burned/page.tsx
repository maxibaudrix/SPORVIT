import { Metadata } from 'next';
import CaloriesBurnedCalculator from './CaloriesBurnedCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Calorías Quemadas por Ejercicio | METs | Sporvit',
  description: 'Calcula con precisión cuántas calorías quemas según tu peso, el tipo de actividad y la duración del ejercicio. Basado en el Compendio de Actividades Físicas (METs).',
  keywords: 'calculadora calorías quemadas, gasto calórico ejercicio, calcular calorías deporte, equivalentes metabólicos, METs ejercicio, calorías running, calorías gimnasio',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-calorias-quemadas' },
  openGraph: {
    title: 'Calculadora de Calorías Quemadas: Mide tu Gasto Energético | Sporvit',
    description: 'Descubre el impacto real de tu entrenamiento en tu balance calórico diario.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-calorias-quemadas',
    type: 'website',
    images: [{ url: '/og-calories-burned.jpg', width: 1200, height: 630, alt: 'Calculadora Calorías Quemadas Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Gasto Calórico por Actividad | Sporvit',
    description: 'Calcula tus calorías quemadas con base científica.',
    images: ['/og-calories-burned.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Calorías Quemadas Sporvit",
    "description": "Herramienta avanzada para estimar el gasto calórico durante diversas actividades físicas utilizando METs.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Base de datos de +20 actividades físicas",
      "Cálculo preciso basado en METs y peso corporal",
      "Resultados por sesión y por hora",
      "Optimización SEO y accesibilidad A11Y",
      "Botones para compartir resultados"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaloriesBurnedCalculator />
    </>
  );
}