import { Metadata } from 'next';
import NavyBodyFatCalculator from './NavyBodyFatCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Grasa Corporal Método Marina | Estimación Precisa | Sporvit',
  description: 'Calcula tu porcentaje de grasa corporal con el método de la Marina de EE. UU. Solo necesitas una cinta métrica. Precisión científica sin básculas de bioimpedancia.',
  keywords: 'calculadora grasa corporal marina, metodo navy grasa corporal, calcular porcentaje grasa cinta metrica, grasa corporal perímetros, salud cardiovascular, composicion corporal gratis',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-grasa-corporal-metodo-marina' },
  openGraph: {
    title: 'Calculadora de Grasa Corporal (Método Marina): Precisión con Cinta | Sporvit',
    description: 'Mide tu grasa corporal usando el estándar de la Marina estadounidense.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-grasa-corporal-metodo-marina',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Grasa Corporal Marina Sporvit",
    "description": "Calculadora basada en las ecuaciones de la US Navy para estimar la grasa corporal mediante perímetros.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Fórmulas oficiales de la US Navy",
      "Diferenciación por género y perímetros específicos",
      "Estimación de masa grasa y masa magra",
      "Contenido educativo de +1000 palabras",
      "Código embed y compartir con resultados"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavyBodyFatCalculator />
    </>
  );
}