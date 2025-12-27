import { Metadata } from 'next';
import HRCaloriesCalculator from './HRCaloriesCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Calorías por Frecuencia Cardíaca | Fórmula Keytel | Sporvit',
  description: 'Calcula con precisión las calorías quemadas usando tus pulsaciones. Basada en la fórmula de Keytel para hombres y mujeres. Ideal para entrenamientos con pulsómetro.',
  keywords: 'calculadora calorías frecuencia cardíaca, gasto calórico pulsaciones, fórmula Keytel, calcular calorías quemadas smartwatch, calorías por bpm, entrenamiento cardio',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-calorias-quemadas-por-frecuencia-cardiaca-2' },
  openGraph: {
    title: 'Calculadora de Calorías por Pulsaciones: Precisión Científica | Sporvit',
    description: 'Obtén el cálculo más exacto de tu gasto energético usando tu frecuencia cardíaca media.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-calorias-quemadas-por-frecuencia-cardiaca-2',
    type: 'website',
    images: [{ url: '/og-hr-calories.jpg', width: 1200, height: 630, alt: 'Calculadora Calorías por FC Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Calorías por Frecuencia Cardíaca | Sporvit',
    description: 'Calcula tus calorías usando tus pulsaciones con rigor científico.',
    images: ['/og-hr-calories.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Calorías por Frecuencia Cardíaca Sporvit",
    "description": "Herramienta de alta precisión para el cálculo de gasto energético basado en la frecuencia cardíaca media y variables antropométricas.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Algoritmo basado en la ecuación de Keytel",
      "Diferenciación por sexo biológico",
      "Cálculo por frecuencia cardíaca media",
      "Optimización SEO con +800 palabras de contenido",
      "Interfaz accesible y mobile-first"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HRCaloriesCalculator />
    </>
  );
}