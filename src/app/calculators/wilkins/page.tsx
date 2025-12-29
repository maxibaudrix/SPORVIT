import { Metadata } from 'next';
import WilksGLCalculator from './WilksGLCalculator';

export const metadata: Metadata = {
  title: 'Calculadora Wilks 2.0 y Puntos GL | Ranking Powerlifting | Sporvit',
  description: 'Compara tu nivel de fuerza en Powerlifting con los coeficientes Wilks 2.0 y GL Points oficiales. El estándar de la IPF para determinar el mejor levantador absoluto.',
  keywords: 'calculadora wilks 2.0, puntos gl powerlifting, fuerza relativa pesas, coeficiente wilks vs gl, calculadora ipf points, ranking powerlifting',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-wilks-2-puntos-gl' },
  openGraph: {
    title: 'Wilks 2.0 y Puntos GL: ¿Quién es el más fuerte? | Sporvit',
    description: 'Calcula tu puntuación competitiva y compárate con la élite del powerlifting mundial.',
    url: 'https://sporvit.com/calculadoras/calculadora-wilks-2-puntos-gl',
    type: 'website',
    images: [{ url: '/og-wilks.jpg', width: 1200, height: 630, alt: 'Calculadora Wilks Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Wilks 2.0 y GL Sporvit",
    "description": "Algoritmo avanzado para la normalización de marcas de fuerza en powerlifting basado en peso corporal.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Coeficiente Wilks 2.0 actualizado",
      "Puntos GL oficiales de la IPF",
      "Comparativa por categorías de peso",
      "Soporte para levantadores masculinos y femeninos"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WilksGLCalculator />
    </>
  );
}