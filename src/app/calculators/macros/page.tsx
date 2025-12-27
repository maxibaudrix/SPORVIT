import { Metadata } from 'next';
import MacroCalculator from './MacroCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Macronutrientes | Calcula Proteínas, Grasas y Carbohidratos | Sporvit',
  description: 'Calcula el reparto ideal de macronutrientes según tu objetivo: ganar músculo, perder grasa o mantenimiento. Ajusta tus macros para optimizar tu rendimiento y salud.',
  keywords: 'calculadora macronutrientes, calcular macros, reparto proteínas grasas carbohidratos, dieta flexible, macros para ganar musculo, macros para perder grasa, IIFYM',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-macronutrientes' },
  openGraph: {
    title: 'Calculadora de Macronutrientes Sporvit: Tu Plan Nutricional Preciso',
    description: 'Descubre cuántos gramos de cada nutriente necesitas para alcanzar tu meta física.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-macronutrientes',
    type: 'website',
    images: [{ url: '/og-macros.jpg', width: 1200, height: 630, alt: 'Calculadora de Macros Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Macronutrientes | Sporvit',
    description: 'Personaliza tu dieta con precisión científica.',
    images: ['/og-macros.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Macronutrientes Sporvit",
    "description": "Herramienta avanzada para el reparto de macronutrientes basado en objetivos deportivos y tipos de dieta.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Reparto personalizado de Proteínas, Grasas y Carbohidratos",
      "Perfiles de dieta: Equilibrada, Baja en Carbohidratos, Alta en Proteína, Keto",
      "Cálculo automático basado en calorías objetivo",
      "Optimización SEO con contenido educativo profundo",
      "Interfaz accesible y mobile-friendly"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MacroCalculator />
    </>
  );
}