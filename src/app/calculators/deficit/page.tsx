import { Metadata } from 'next';
import CaloricDeficitCalculator from './CaloricDeficitCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Déficit Calórico | Pierde Grasa de Forma Segura | Sporvit',
  description: 'Calcula tu déficit calórico ideal para perder grasa corporal sin sacrificar masa muscular. Basada en ciencia nutricional y tasas metabólicas precisas.',
  keywords: 'calculadora déficit calórico, déficit para perder grasa, cuántas calorías para adelgazar, bajar de peso saludablemente, tdee deficit, perder peso por ciento',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-deficit-calorico' },
  openGraph: {
    title: 'Calculadora de Déficit Calórico: Tu Plan para Perder Grasa | Sporvit',
    description: 'Descubre cuántas calorías necesitas para quemar grasa de manera sostenible y eficiente.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-deficit-calorico',
    type: 'website',
    images: [{ url: '/og-deficit.jpg', width: 1200, height: 630, alt: 'Calculadora de Déficit Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Déficit Calórico | Sporvit',
    description: 'Calcula tu ingesta ideal para una definición perfecta.',
    images: ['/og-deficit.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Déficit Calórico Sporvit",
    "description": "Herramienta científica para determinar la ingesta calórica necesaria para la pérdida de grasa controlada.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cálculo de TDEE basado en Mifflin-St Jeor",
      "Déficit personalizable (Conservador, Moderado, Agresivo)",
      "Estimación de pérdida de peso semanal",
      "Optimización SEO con contenido experto",
      "Interfaz 100% accesible y mobile-first"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaloricDeficitCalculator />
    </>
  );
}