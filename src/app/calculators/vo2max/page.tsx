import { Metadata } from 'next';
import VO2MaxCalculator from './VO2MaxCalculator';

export const metadata: Metadata = {
  title: 'Calculadora VO2 Max | Test de Cooper y Frecuencia Cardíaca | Sporvit',
  description: 'Calcula tu VO2 Max de forma precisa. Estima tu capacidad cardiovascular con el Test de Cooper o mediante tu frecuencia cardíaca. Mejora tu rendimiento aeróbico.',
  keywords: 'calculadora vo2 max, estimar vo2 max, test de cooper online, capacidad aerobica, consumo maximo oxigeno, salud cardiovascular, rendimiento endurance',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-vo2-max' },
  openGraph: {
    title: 'Calculadora VO2 Max: Mide tu Potencia Aeróbica | Sporvit',
    description: '¿Qué tan eficiente es tu corazón? Calcula tu VO2 Max con rigor científico.',
    url: 'https://sporvit.com/calculadoras/calculadora-vo2-max',
    type: 'website',
    images: [{ url: '/og-vo2-max.jpg', width: 1200, height: 630, alt: 'Calculadora VO2 Max Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora VO2 Max Sporvit",
    "description": "Herramienta avanzada para la estimación del consumo máximo de oxígeno basada en protocolos de rendimiento y frecuencia cardíaca.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Estimación mediante Test de Cooper (12 min)",
      "Cálculo por Ratio de Frecuencia Cardíaca (Uth et al.)",
      "Clasificación por edad y género",
      "Interfaz optimizada para dispositivos móviles",
      "Código embed para profesionales de la salud"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VO2MaxCalculator />
    </>
  );
}