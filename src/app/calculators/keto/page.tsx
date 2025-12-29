import { Metadata } from 'next';
import KetoCalculator from './KetoCalculator';

export const metadata: Metadata = {
  title: 'Calculadora Keto | Macros para Cetosis Nutricional | Sporvit',
  description: 'Calcula tus macros para la dieta keto. Determina la cantidad exacta de grasas, proteínas y carbohidratos netos para entrar en cetosis y perder grasa de forma eficiente.',
  keywords: 'calculadora keto, dieta cetogenica macros, carbohidratos netos keto, adelgazar con keto, calcular cetosis, grasas saludables keto, nutricion funcional',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-keto' },
  openGraph: {
    title: 'Calculadora Keto Sporvit: Tu Guía Hacia la Cetosis',
    description: 'Ajusta tus macros para convertir tu cuerpo en una máquina de quemar grasa.',
    url: 'https://sporvit.com/calculadoras/calculadora-keto',
    type: 'website',
    images: [{ url: '/og-keto.jpg', width: 1200, height: 630, alt: 'Calculadora Keto Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Keto Sporvit",
    "description": "Herramienta avanzada para el cálculo de macronutrientes en dietas cetogénicas.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de carbohidratos netos (< 30g)",
      "Ajuste de proteínas para preservación muscular",
      "Ratio de grasas cetogénicas optimizado",
      "Interfaz premium e intuitiva",
      "Código embed y compartir resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KetoCalculator />
    </>
  );
}