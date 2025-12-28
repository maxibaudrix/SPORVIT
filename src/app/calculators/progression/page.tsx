import { Metadata } from 'next';
import ProgressionCalculator from './ProgressionCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Progresión de Entrenamiento | Sobrecarga Progresiva | Sporvit',
  description: 'Planifica tu sobrecarga progresiva de forma científica. Calcula tus incrementos de carga semanales para maximizar la fuerza y la hipertrofia muscular.',
  keywords: 'calculadora progresion entrenamiento, sobrecarga progresiva, progresion lineal gimnasio, planificar cargas entrenamiento, mesociclo fuerza, hipertrofia progreso',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-progresion-de-entrenamiento' },
  openGraph: {
    title: 'Calculadora de Progresión de Entrenamiento: Crece sin Estancarte | Sporvit',
    description: 'Proyecta tus levantamientos y asegura el progreso constante en cada sesión.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-progresion-de-entrenamiento',
    type: 'website',
    images: [{ url: '/og-progression.jpg', width: 1200, height: 630, alt: 'Calculadora Progresión Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Progresión de Entrenamiento Sporvit",
    "description": "Herramienta avanzada para la planificación de la sobrecarga progresiva en programas de fuerza e hipertrofia.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Proyección de cargas semanales",
      "Modelos de progresión lineal y porcentual",
      "Planificación de mesociclos (4-12 semanas)",
      "Interfaz optimizada para móviles",
      "Botones de compartir con objetivos de fuerza"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProgressionCalculator />
    </>
  );
}