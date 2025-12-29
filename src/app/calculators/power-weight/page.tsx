import { Metadata } from 'next';
import PowerToWeightCalculator from './PowerToWeightCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Ratio Potencia-Peso (W/kg) | Ciclismo | Sporvit',
  description: 'Calcula tu ratio de vatios por kilo (W/kg). Compara tu nivel de rendimiento en ciclismo con estándares profesionales y optimiza tu potencia en subida.',
  keywords: 'vatios kilo ciclismo, ratio potencia peso, calcular w/kg, rendimiento ciclista, potencia en subida, vatios por kilo pro, ftp por peso',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-ratio-potencia-peso' },
  openGraph: {
    title: 'Calculadora de W/kg: ¿Cuál es tu Nivel Ciclista? | Sporvit',
    description: 'Descubre tu potencia relativa y compárate con los ciclistas del World Tour.',
    url: 'https://sporvit.com/calculadoras/calculadora-ratio-potencia-peso',
    type: 'website',
    images: [{ url: '/og-power-weight.jpg', width: 1200, height: 630, alt: 'Ratio Potencia Peso Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Ratio Potencia-Peso Sporvit",
    "description": "Herramienta técnica para ciclistas que mide la potencia relativa al peso corporal.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo instantáneo de W/kg",
      "Tabla de categorías competitivas (Coggan)",
      "Análisis para subida y rendimiento endurance",
      "Código embed funcional",
      "Compartir resultados detallados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PowerToWeightCalculator />
    </>
  );
}