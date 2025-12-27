import { Metadata } from 'next';
import GEBCalculator from './GEBCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Gasto Energético Basal (GEB) | Metabolismo Base | Sporvit',
  description: 'Calcula tu Gasto Energético Basal (GEB) con precisión científica. Descubre cuántas calorías necesita tu cuerpo para sus funciones vitales en reposo.',
  keywords: 'GEB, gasto energetico basal, calcular metabolismo basal, formula mifflin st jeor, calorias en reposo, BMR calculator, nutricion deportiva',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-gasto-energetico-basal-geb' },
  openGraph: {
    title: 'Calculadora de Gasto Energético Basal (GEB) | Sporvit',
    description: 'Calcula el presupuesto energético base de tu organismo.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-gasto-energetico-basal-geb',
    type: 'website',
    images: [{ url: '/og-geb.jpg', width: 1200, height: 630, alt: 'Calculadora GEB Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de GEB Sporvit",
    "description": "Herramienta avanzada para el cálculo del metabolismo basal basada en Mifflin-St Jeor.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Cálculo preciso de GEB", "Ajuste por sexo, edad y peso", "Información educativa nutricional", "Interfaz accesible A11Y", "Código embebible para blogs"]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GEBCalculator />
    </>
  );
}