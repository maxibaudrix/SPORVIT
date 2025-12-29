import { Metadata } from 'next';
import CunninghamCalculator from './CunninghamCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Metabolismo Cunningham | Masa Libre de Grasa | Sporvit',
  description: 'Calcula tu gasto metabólico basal con la fórmula de Cunningham. La herramienta más precisa para atletas y culturistas basada en la masa libre de grasa (LBM).',
  keywords: 'formula cunningham metabolismo, calcular bmr atletas, masa libre de grasa metabolismo, gasto basal culturismo, nutricion deportiva avanzada, lbm basal rate',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-metabolismo-basal-cunningham' },
  openGraph: {
    title: 'Fórmula de Cunningham: Precisión Metabólica para Atletas | Sporvit',
    description: 'Determina tus necesidades calóricas reales según tu masa muscular con precisión científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-metabolismo-basal-cunningham',
    type: 'website',
    images: [{ url: '/og-cunningham.jpg', width: 1200, height: 630, alt: 'Calculadora Cunningham Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Cunningham Sporvit",
    "description": "Herramienta de precisión para el cálculo de la tasa metabólica basal en poblaciones atléticas mediante masa magra.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo basado en Masa Libre de Grasa (LBM)",
      "Precisión superior para culturistas y atletas",
      "Interfaz optimizada para alto rendimiento",
      "Código embed profesional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CunninghamCalculator />
    </>
  );
}