import { Metadata } from 'next';
import ProteinCalculator from './ProteinCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Ingesta de Proteínas | Cuánta Proteína Tomar | Sporvit',
  description: 'Calcula tu necesidad diaria de proteína según tu peso, nivel de actividad y objetivo fitness. Basada en las últimas recomendaciones de nutrición deportiva.',
  keywords: 'calculadora proteinas diarias, cuanta proteina tomar, proteinas por kilo, ganar musculo proteina, dieta alta en proteinas, nutricion deportiva proteinas',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-de-ingesta-de-proteinas' },
  openGraph: {
    title: 'Calculadora de Ingesta de Proteínas | Optimiza tu Músculo | Sporvit',
    description: 'Descubre cuántos gramos de proteína necesitas realmente para alcanzar tus objetivos de rendimiento.',
    url: 'https://sporvit.com/calculadoras/calculadora-de-ingesta-de-proteinas',
    type: 'website',
    images: [{ url: '/og-protein.jpg', width: 1200, height: 630, alt: 'Calculadora de Proteínas Sporvit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Proteínas Diarias | Sporvit',
    description: 'Calcula tu ingesta proteica ideal con rigor científico.',
    images: ['/og-protein.jpg'],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Proteína Sporvit",
    "description": "Calculadora avanzada para determinar los requerimientos proteicos diarios según perfil atlético.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Rangos personalizados (0.8g a 2.5g por kg)",
      "Ajuste por objetivo: Ganar músculo, Perder grasa, Salud general",
      "Sugerencia de proteínas por comida",
      "Interfaz accesible y optimizada para SEO",
      "Código embed para sitios externos"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProteinCalculator />
    </>
  );
}