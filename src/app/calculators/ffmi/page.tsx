import { Metadata } from 'next';
import FFMICalculator from './FFMICalculator';

export const metadata: Metadata = {
  title: 'Calculadora de FFMI | Índice de Masa Libre de Grasa | Sporvit',
  description: 'Calcula tu FFMI (Fat-Free Mass Index) y descubre tu potencial genético muscular. La métrica definitiva para culturistas naturales y atletas de fuerza.',
  keywords: 'FFMI calculator, calculadora ffmi, masa libre de grasa, potencial genetico muscular, limite natural culturismo, indice masa magra, grasa corporal ffmi',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-indice-de-masa-libre-de-grasa-ffmi' },
  openGraph: {
    title: 'Calculadora de FFMI: Mide tu Potencial Muscular | Sporvit',
    description: '¿Cuál es tu límite genético? Calcula tu Índice de Masa Libre de Grasa con precisión científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-indice-de-masa-libre-de-grasa-ffmi',
    type: 'website',
    images: [{ url: '/og-ffmi.jpg', width: 1200, height: 630, alt: 'Calculadora FFMI Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de FFMI Sporvit",
    "description": "Analizador avanzado de masa muscular y potencial genético basado en el Índice de Masa Libre de Grasa.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo de FFMI y FFMI Normalizado",
      "Estimación de masa magra total",
      "Clasificación por potencial muscular",
      "Interfaz premium accesible",
      "Código embed funcional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FFMICalculator />
    </>
  );
}