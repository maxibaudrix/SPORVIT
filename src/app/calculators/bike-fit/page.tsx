import { Metadata } from 'next';
import BikeFitCalculator from './BikeFitCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Talla de Bicicleta y Configuración | Bike Fit | Sporvit',
  description: 'Calcula la talla ideal de tu cuadro de bicicleta (Carretera, MTB, Gravel) y la altura del sillín. Basado en biomecánica para optimizar potencia y evitar lesiones.',
  keywords: 'talla bicicleta carretera, calcular talla mtb, altura sillin bicicleta, bike fit online, medida cuadro bici, biomecanica ciclismo, calculadora ciclismo',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-tamano-de-cuadro-y-configuracion-de-bicicleta' },
  openGraph: {
    title: 'Calculadora de Bike Fit: Talla y Configuración Ideal | Sporvit',
    description: 'Encuentra tu talla de cuadro y altura de sillín con precisión biomecánica.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-tamano-de-cuadro-y-configuracion-de-bicicleta',
    type: 'website',
    images: [{ url: '/og-bike-fit.jpg', width: 1200, height: 630, alt: 'Calculadora Bike Fit Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Bike Fit Sporvit",
    "description": "Herramienta técnica para el cálculo de tallas de cuadro y ajustes biomecánicos de bicicleta.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de talla para Carretera (cm) y MTB (pulgadas)",
      "Altura de sillín mediante Método LeMond",
      "Ajuste de alcance (Reach) sugerido",
      "Interfaz optimizada para móviles",
      "Resultados compartibles con medidas exactas"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BikeFitCalculator />
    </>
  );
}