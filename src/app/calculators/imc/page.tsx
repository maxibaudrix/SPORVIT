import { Metadata } from 'next';
import BMICalculator from './BMICalculator';

export const metadata: Metadata = {
  title: 'Calculadora de IMC | Índice de Masa Corporal | Sporvit',
  description: 'Calcula tu IMC gratis. Descubre si estás en tu peso ideal y conoce los rangos de salud según la OMS. Herramienta rápida, precisa y fácil de usar.',
  keywords: 'calculadora IMC, indice de masa corporal, peso ideal, calcular IMC mujer, calcular IMC hombre, salud corporal, sobrepeso y obesidad',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-imc' },
  openGraph: {
    title: 'Calculadora de IMC: Mide tu Composición Básica | Sporvit',
    description: 'Calcula tu Índice de Masa Corporal en segundos y conoce tu categoría de salud.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-imc',
    type: 'website',
    images: [{ url: '/og-imc.jpg', width: 1200, height: 630, alt: 'Calculadora IMC Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de IMC | Sporvit',
    description: 'Herramienta de diagnóstico básico de salud corporal.',
    images: ['/og-imc.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de IMC Sporvit",
    "description": "Calculadora gratuita de Índice de Masa Corporal con clasificación por categorías de la OMS.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo instantáneo de IMC",
      "Clasificación oficial (Bajo peso, Normal, Sobrepeso, Obesidad)",
      "Sugerencia de rango de peso saludable",
      "Optimización para móviles y accesibilidad",
      "Código embed para sitios web"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BMICalculator />
    </>
  );
}