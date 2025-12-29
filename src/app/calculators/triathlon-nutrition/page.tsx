import { Metadata } from 'next';
import TriathlonNutritionCalculator from './TriathlonNutritionCalculator';

export const metadata: Metadata = {
  title: 'Calculadora Nutricional para Triatlón | Plan de Carrera | Sporvit',
  description: 'Planifica tu nutrición para triatlón (Sprint, Olímpico, 70.3, Ironman). Calcula carbohidratos por hora, sodio e hidratación para evitar el muro.',
  keywords: 'nutricion triatlon, calcular carbohidratos triatlon, plan nutricional ironman, sales triatlon, hidratacion carrera, suplementacion triatleta',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-nutricional-para-triatlones' },
  openGraph: {
    title: 'Estrategia Nutricional para Triatlón: El Cuarto Segmento | Sporvit',
    description: 'Calcula tu aporte de energía y sales para el día de la competición.',
    url: 'https://sporvit.com/calculadoras/calculadora-nutricional-para-triatlones',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Nutricional Triatlón Sporvit",
    "description": "Herramienta técnica para el cálculo de necesidades energéticas y electrolitos en competiciones de triatlón.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de CHO/hora según distancia",
      "Plan de hidratación por segmentos",
      "Requerimientos de sodio (electrolitos)",
      "Ajuste por tiempo objetivo",
      "Código embed y compartir resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TriathlonNutritionCalculator />
    </>
  );
}