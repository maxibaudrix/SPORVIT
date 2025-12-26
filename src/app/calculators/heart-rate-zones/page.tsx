// src/app/calculators/heart-rate-zones/page.tsx
import { Metadata } from 'next';
import HRZonesCalculator from './HRZonesCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Zonas de Frecuencia Cardíaca | Sporvit',
  description: 'Calcula tus zonas de entrenamiento cardiovascular con la fórmula de Karvonen. Optimiza tu rendimiento conociendo tus rangos de FC ideales para cada objetivo.',
  keywords: 'zonas frecuencia cardíaca, calculadora FC, Karvonen, entrenamiento por zonas, FC máxima, frecuencia cardíaca óptima, zonas cardiovasculares',
  openGraph: {
    title: 'Calculadora de Zonas de Frecuencia Cardíaca - Sporvit',
    description: 'Descubre tus zonas de entrenamiento cardiovascular personalizadas con el método Karvonen',
    type: 'website',
    url: 'https://sporvit.com/calculators/heart-rate-zones',
    images: [{
      url: '/og-hr-zones.jpg',
      width: 1200,
      height: 630,
      alt: 'Calculadora de Zonas de Frecuencia Cardíaca Sporvit',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Zonas de FC - Sporvit',
    description: 'Calcula tus zonas de entrenamiento con la fórmula de Karvonen',
    images: ['/og-hr-zones.jpg'],
  },
  alternates: {
    canonical: 'https://sporvit.com/calculators/heart-rate-zones',
  },
};

export default function Page() {
  return <HRZonesCalculator />;
}