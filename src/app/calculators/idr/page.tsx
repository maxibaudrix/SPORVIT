import { Metadata } from 'next';
import IDRCalculator from './IDRCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de IDR (Ingesta Diaria Recomendada) | Sporvit',
  description: 'Calcula tu Ingesta Diaria Recomendada (IDR) de macronutrientes, fibra y micronutrientes esenciales. Optimiza tu salud con guías nutricionales personalizadas.',
  keywords: 'calculadora IDR, ingesta diaria recomendada, RDA nutrición, cuanta fibra tomar al día, vitaminas recomendadas diarias, guia nutricional personalizada',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-idr-ingesta-diaria-recomendada-2' },
  openGraph: {
    title: 'Calculadora de IDR: Guía Nutricional Personalizada | Sporvit',
    description: 'Obtén tu perfil completo de necesidades nutricionales diarias según tu edad y sexo.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-idr-ingesta-diaria-recomendada-2',
    type: 'website',
    images: [{ url: '/og-idr.jpg', width: 1200, height: 630, alt: 'Calculadora IDR Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de IDR Nutricional | Sporvit',
    description: 'Calcula tus necesidades de nutrientes con rigor científico.',
    images: ['/og-idr.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de IDR Sporvit",
    "description": "Herramienta avanzada para el cálculo de la Ingesta Diaria Recomendada de nutrientes esenciales.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo de Fibra y Agua",
      "Recomendaciones de Proteínas y Grasas",
      "Guía de Micronutrientes (Calcio, Hierro, Vitamina C)",
      "Ajuste por edad y sexo biológico",
      "Interfaz accesible y código embed"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IDRCalculator />
    </>
  );
}