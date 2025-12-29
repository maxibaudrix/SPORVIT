import { Metadata } from 'next';
import HydrationCalculator from './HydrationCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Tasa de Sudoración e Hidratación | Sporvit',
  description: 'Calcula tu tasa de sudoración exacta y tu plan de hidratación para competencias. Evita la deshidratación y los calambres con precisión científica.',
  keywords: 'tasa de sudoracion, calcular hidratacion running, reposicion electrolitos triatlon, perdida de liquidos ejercicio, sodio por hora, deshidratacion deportiva',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-hidratacion-y-tasa-de-sudoracion' },
  openGraph: {
    title: 'Calculadora de Tasa de Sudoración e Hidratación | Sporvit',
    description: 'Descubre cuánto líquido pierdes y cómo reponerlo para maximizar tu rendimiento.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-hidratacion-y-tasa-de-sudoracion',
    type: 'website',
    images: [{ url: '/og-hydration.jpg', width: 1200, height: 630, alt: 'Calculadora Hidratación Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Tasa de Sudoración e Hidratación Sporvit",
    "description": "Herramienta técnica para calcular la pérdida de fluidos y necesidades de electrolitos durante el ejercicio.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de Tasa de Sudoración (L/h)",
      "Porcentaje de deshidratación por sesión",
      "Plan de reposición de sodio sugerido",
      "Interfaz optimizada para móviles",
      "Resultados técnicos para atletas de élite"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HydrationCalculator />
    </>
  );
}