import { Metadata } from 'next';
import KatchMcArdleCalculator from './KatchMcArdleCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Metabolismo Basal Katch-McArdle | Precisión Máxima | Sporvit',
  description: 'Calcula tu Tasa Metabólica Basal (TMB) con la fórmula de Katch-McArdle. La más precisa para atletas y personas que conocen su porcentaje de grasa corporal.',
  keywords: 'calculadora Katch-McArdle, metabolismo basal masa magra, TMB atletas, formula Katch-McArdle, tasa metabolica basal precisa, calcular BMR grasa corporal',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-metabolismo-basal-katch-mcardle' },
  openGraph: {
    title: 'Calculadora Katch-McArdle: Tu Metabolismo Basal Real | Sporvit',
    description: 'Calcula tu BMR basándote en tu tejido muscular real, no solo en tu peso total.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-metabolismo-basal-katch-mcardle',
    type: 'website',
    images: [{ url: '/og-katch.jpg', width: 1200, height: 630, alt: 'Calculadora Katch-McArdle Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Katch-McArdle Sporvit",
    "description": "Herramienta de alta precisión para el cálculo del metabolismo basal basada en la masa libre de grasa.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Fórmula de Katch-McArdle para atletas",
      "Cálculo automático de Masa Magra (LBM)",
      "Resultados con desglose de calorías diarias",
      "Interfaz accesible y código embed",
      "Compartir resultados con datos reales"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KatchMcArdleCalculator />
    </>
  );
}