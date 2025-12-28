import { Metadata } from 'next';
import MacroDietCalculator from './MacroDietCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Macronutrientes por Dieta | Personaliza tu Nutrición | Sporvit',
  description: 'Calcula tus macros según tu tipo de dieta: Keto, Paleo, Mediterránea o Zona. Optimiza tu reparto de proteínas, grasas y carbohidratos con precisión científica.',
  keywords: 'calculadora macros dieta, macros keto, macros paleo, dieta mediterranea porcentajes, reparto macronutrientes, nutrición personalizada, IIFYM dieta',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-macronutrientes-por-dieta' },
  openGraph: {
    title: 'Calculadora de Macros por Dieta: Tu Plan Nutricional | Sporvit',
    description: 'Ajusta tus nutrientes según el protocolo dietético que elijas.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-macronutrientes-por-dieta',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Macros por Dieta Sporvit",
    "description": "Herramienta avanzada para el reparto de macronutrientes basado en protocolos dietéticos específicos.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Perfiles de dieta: Mediterránea, Paleo, Keto, Zona, Alta Proteína",
      "Cálculo exacto en gramos y calorías",
      "Optimización SEO con contenido experto",
      "Interfaz accesible A11Y",
      "Código embebible funcional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MacroDietCalculator />
    </>
  );
}