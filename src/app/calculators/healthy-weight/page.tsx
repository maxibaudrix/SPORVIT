import { Metadata } from 'next';
import HealthyWeightLossCalculator from './HealthyWeightLossCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Pérdida de Peso Semanal Saludable | Sporvit',
  description: 'Calcula tu ritmo ideal de pérdida de peso semanal según tu peso actual. Evita el efecto rebote y la pérdida de masa muscular con un plan sostenible.',
  keywords: 'perdida de peso saludable por semana, cuanto peso perder semanalmente, ritmo quema grasa, deficit calorico saludable, retencion masa muscular dieta, objetivos perdida peso',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-perdida-peso-semanal-saludable' },
  openGraph: {
    title: 'Ritmo de Pérdida Saludable: Tu Plan Sostenible | Sporvit',
    description: '¿Cuánto peso deberías perder por semana? Descubre tu rango óptimo para no perder músculo.',
    url: 'https://sporvit.com/calculadoras/calculadora-perdida-peso-semanal-saludable',
    type: 'website',
    images: [{ url: '/og-weight-loss.jpg', width: 1200, height: 630, alt: 'Pérdida de Peso Saludable Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Pérdida de Peso Saludable Sporvit",
    "description": "Herramienta técnica para establecer objetivos de reducción de peso basados en porcentajes seguros del peso corporal.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo por porcentaje de peso corporal (0.5% - 1.5%)",
      "Estimación de déficit calórico diario requerido",
      "Indicador de preservación de masa muscular",
      "Interfaz premium e intuitiva"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HealthyWeightLossCalculator />
    </>
  );
}