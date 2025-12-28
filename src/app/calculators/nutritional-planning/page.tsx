import { Metadata } from 'next';
import NutritionalPlanningCalculator from './NutritionalPlanningCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Planificación Nutricional | Estructura tu Dieta | Sporvit',
  description: 'Planifica tu dieta de forma profesional. Calcula calorías y macros para volumen, definición o mantenimiento. Ajusta tu reparto de nutrientes según tu objetivo fitness.',
  keywords: 'planificacion nutricional, calculadora dieta, macros volumen, macros definicion, estructurar dieta gimnasio, deficit calorico plan, superavit calorico',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-planificacion-nutricional' },
  openGraph: {
    title: 'Planificación Nutricional Inteligente: Crea tu Dieta | Sporvit',
    description: 'Estructura tus macros y calorías por fases de entrenamiento con rigor científico.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-planificacion-nutricional',
    type: 'website',
    images: [{ url: '/og-nutri-plan.jpg', width: 1200, height: 630, alt: 'Planificación Nutricional Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Planificación Nutricional Sporvit",
    "description": "Herramienta avanzada para la estructuración de planes nutricionales basados en objetivos de composición corporal.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Ajuste por agresividad del objetivo",
      "Repartos de macros personalizables",
      "Cálculo de superávit y déficit controlado",
      "Guía de planificación por fases",
      "Botones de compartir con desglose de dieta"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NutritionalPlanningCalculator />
    </>
  );
}