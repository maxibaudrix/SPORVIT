import { Metadata } from 'next';
import OneRMCalculator from './OneRMCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de 1RM | Estima tu Fuerza Máxima | Sporvit',
  description: 'Calcula tu repetición máxima (1RM) de forma segura. Utiliza las fórmulas de Brzycki y Epley para determinar tus cargas de entrenamiento y porcentajes de fuerza.',
  keywords: 'calculadora 1RM, calcular repeticion maxima, formula brzycki, formula epley, fuerza maxima gimnasio, estimar 1RM, porcentajes de carga',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-1rm-una-repeticion-maxima' },
  openGraph: {
    title: 'Calculadora de 1RM Sporvit: Mide tu Fuerza Real',
    description: 'Calcula tu 1RM sin riesgo y planifica tus porcentajes de entrenamiento.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-1rm-una-repeticion-maxima',
    type: 'website',
    images: [{ url: '/og-1rm.jpg', width: 1200, height: 630, alt: 'Calculadora 1RM Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de 1RM Sporvit",
    "description": "Calculadora de fuerza máxima basada en repeticiones al fallo técnico utilizando algoritmos de Brzycki y Epley.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo por fórmula de Brzycki (Alta precisión < 10 reps)",
      "Cálculo por fórmula de Epley",
      "Tabla de porcentajes de carga (50% - 95%)",
      "Interfaz accesible y mobile-first",
      "Código embed para blogs de fuerza"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OneRMCalculator />
    </>
  );
}