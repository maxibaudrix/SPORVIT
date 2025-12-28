import { Metadata } from 'next';
import IdealWeightCalculator from './IdealWeightCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Peso Ideal | Fórmulas Devine, Hamwi y Miller | Sporvit',
  description: 'Calcula tu peso ideal con precisión científica. Utilizamos las fórmulas de Devine, Robinson, Miller y Hamwi para ofrecerte un rango de peso saludable según tu estatura.',
  keywords: 'calculadora peso ideal, peso ideal por altura, formula de devine peso, formula de hamwi, peso ideal mujer, peso ideal hombre, rango de peso saludable',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-peso-ideal' },
  openGraph: {
    title: 'Calculadora de Peso Ideal Sporvit: Precisión Clínica',
    description: 'Descubre tu rango de peso óptimo basado en las fórmulas más utilizadas en medicina y nutrición.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-peso-ideal',
    type: 'website',
    images: [{ url: '/og-weight.jpg', width: 1200, height: 630, alt: 'Calculadora Peso Ideal Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Peso Ideal Sporvit",
    "description": "Calculadora avanzada que utiliza múltiples fórmulas clínicas para determinar el peso ideal según altura y sexo.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Fórmula de Devine",
      "Fórmula de Robinson",
      "Fórmula de Miller",
      "Fórmula de Hamwi",
      "Rango de salud basado en IMC",
      "Código embed y compartir resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdealWeightCalculator />
    </>
  );
}