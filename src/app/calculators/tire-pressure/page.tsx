import { Metadata } from 'next';
import TirePressureCalculator from './TirePressureCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Presión de Neumáticos Ciclismo | Presión Ideal | Sporvit',
  description: 'Calcula la presión ideal de tus neumáticos para carretera, MTB o gravel. Optimiza la resistencia a la rodadura y mejora el agarre con nuestra calculadora técnica.',
  keywords: 'presion neumaticos bicicleta, calculadora presion ciclismo, presion tubeless carretera, presion mtb bar psi, resistencia rodadura bicicleta, mantenimiento bici',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-presion-de-neumaticos' },
  openGraph: {
    title: 'Calculadora de Presión de Neumáticos: Máxima Eficiencia | Sporvit',
    description: 'Ajusta tus PSI/BAR según tu peso, terreno y tipo de cubierta.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-presion-de-neumaticos',
    type: 'website',
    images: [{ url: '/og-tire-pressure.jpg', width: 1200, height: 630, alt: 'Calculadora Presión Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Presión de Neumáticos Sporvit",
    "description": "Herramienta técnica para ciclistas que calcula la presión óptima en PSI y BAR basándose en el sistema de peso total y superficie.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Cálculo para Carretera, Gravel y MTB",
      "Ajuste por peso del sistema (Bici + Ciclista)",
      "Soporte para cámaras, tubeless y tubulares",
      "Conversión instantánea BAR/PSI",
      "Contenido técnico avanzado para SEO"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TirePressureCalculator />
    </>
  );
}