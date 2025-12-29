import { Metadata } from 'next';
import CHOLoadingCalculator from './CHOLoadingCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Carga de Carbohidratos | Supercompensación | Sporvit',
  description: 'Calcula tu carga de carbohidratos para maratón, Ironman o ciclismo. Optimiza tus reservas de glucógeno con las cantidades exactas de gramos por día.',
  keywords: 'carga carbohidratos maraton, supercompensacion glucogeno, cuanto comer antes de maraton, gramos carbohidratos por kilo, nutricion deportiva carga, tapering nutricional',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-carga-de-carbohidratos' },
  openGraph: {
    title: 'Calculadora de Carga de Carbohidratos: Energía al Máximo | Sporvit',
    description: 'Satura tus depósitos de glucógeno y evita el muro con un plan de carga científico.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-carga-de-carbohidratos',
    type: 'website',
    images: [{ url: '/og-cho-loading.jpg', width: 1200, height: 630, alt: 'Carga Carbohidratos Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Carga de CHO Sporvit",
    "description": "Herramienta para calcular la ingesta de carbohidratos necesaria para la supercompensación de glucógeno pre-competencia.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de gramos de CHO por kg de peso",
      "Ajuste por duración del evento (Maratón, Ultra, Ironman)",
      "Desglose de calorías provenientes de CHO",
      "Plan de 48-72 horas de carga",
      "Interfaz premium optimizada"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CHOLoadingCalculator />
    </>
  );
}