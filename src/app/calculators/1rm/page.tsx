import { Metadata } from 'next';
import OneRMCalculator from './OneRMCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de 1RM (Repetición Máxima) | Estimador de Fuerza | Sporvit',
  description: 'Calcula tu 1RM (Repetición Máxima) de forma segura. Utiliza las fórmulas de Brzycki, Epley y Lander para estimar tu fuerza máxima y planificar tus porcentajes de entrenamiento.',
  keywords: 'calculadora 1rm, repetición máxima, fuerza máxima, powerlifting, brzycki, epley, porcentajes de carga, entrenamiento de fuerza, gimnasio',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-1rm-repeticion-maxima' },
  openGraph: {
    title: 'Calculadora de 1RM - Estima tu Fuerza Máxima | Sporvit',
    description: 'Descubre cuánto peso puedes levantar a una repetición y optimiza tu rutina de fuerza.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-1rm-repeticion-maxima',
    type: 'website',
    images: [{ url: '/og-1rm.jpg', width: 1200, height: 630, alt: 'Calculadora 1RM Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de 1RM | Sporvit',
    description: 'Calcula tu fuerza máxima con precisión científica.',
    images: ['/og-1rm.jpg'],
  },
};

export default function Page() {
  // JSON-LD Schema para Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de 1RM Sporvit",
    "description": "Herramienta avanzada para calcular la repetición máxima (1RM) basada en fórmulas científicas.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cálculo por fórmula de Brzycki",
      "Cálculo por fórmula de Epley",
      "Tabla de porcentajes de carga (50%-95%)",
      "Optimización SEO y Mobile-First",
      "Interfaz accesible A11Y"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OneRMCalculator />
    </>
  );
}