import { Metadata } from 'next';
import CompetitionHydrationCalculator from './CompetitionHydrationCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Hidratación para Competencias | Plan de Carrera | Sporvit',
  description: 'Planifica tu hidratación para maratones, triatlones y ciclismo. Estima el consumo de agua y sodio según el clima, duración e intensidad de la competencia.',
  keywords: 'plan hidratacion competencia, cuanta agua beber carrera, hidratacion maraton, sales y electrolitos triatlon, estrategia hidratacion ciclismo, calcular sodio carrera',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-hidratacion-para-competencias' },
  openGraph: {
    title: 'Estrategia de Hidratación Pro: Tu Plan de Competencia | Sporvit',
    description: 'Calcula tu consumo de líquidos y sales para el día del evento según el clima y la intensidad.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-hidratacion-para-competencias',
    type: 'website',
    images: [{ url: '/og-race-hydration.jpg', width: 1200, height: 630, alt: 'Plan de Hidratación Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Hidratación para Competencias Sporvit",
    "description": "Herramienta de planificación para la reposición de fluidos y electrolitos en eventos deportivos de larga duración.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Ajuste por condiciones climáticas (Frío a Extremo)",
      "Estimación de sodio (mg) por hora",
      "Plan de ingesta total y por intervalos",
      "Optimización para Running, Ciclismo y Triatlón",
      "Interfaz de alto rendimiento"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompetitionHydrationCalculator />
    </>
  );
}