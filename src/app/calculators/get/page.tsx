import { Metadata } from 'next';
import GETCalculator from './GETCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Gasto Energético Total (GET) | TDEE Preciso | Sporvit',
  description: 'Calcula tu Gasto Energético Total (GET) o TDEE. Descubre cuántas calorías quemas realmente al día incluyendo tu actividad física y ejercicio.',
  keywords: 'GET, TDEE, gasto energetico total, calcular calorias diarias, mantenimiento calorico, formula mifflin st jeor actividad, metabolismo total',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-gasto-energetico-total-get' },
  openGraph: {
    title: 'Calculadora de Gasto Energético Total (GET) - Sporvit',
    description: 'La herramienta definitiva para conocer tu consumo calórico real diario.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-gasto-energetico-total-get',
    type: 'website',
    images: [{ url: '/og-get.jpg', width: 1200, height: 630, alt: 'Calculadora GET TDEE Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora TDEE / GET | Sporvit',
    description: 'Calcula tus calorías de mantenimiento con precisión científica.',
    images: ['/og-get.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Gasto Energético Total (GET) Sporvit",
    "description": "Herramienta avanzada para calcular el TDEE basada en el metabolismo basal y el factor de actividad física.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Cálculo basado en Mifflin-St Jeor",
      "Ajuste por 5 niveles de actividad física",
      "Desglose por objetivos (Volumen, Definición, Mantenimiento)",
      "Interfaz accesible y optimizada para SEO",
      "Código embed para blogs de fitness"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GETCalculator />
    </>
  );
}