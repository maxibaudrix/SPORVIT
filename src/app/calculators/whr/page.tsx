import { Metadata } from 'next';
import WHRCalculator from './WHRCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Relación Cintura-Cadera y Cintura-Altura | Sporvit',
  description: 'Evalúa tu riesgo cardiovascular con los índices WHR y WHtR. Herramienta de salud metabólica más precisa que el IMC para medir la grasa abdominal.',
  keywords: 'relacion cintura cadera, indice cintura altura, riesgo cardiovascular grasa abdominal, calculadora whr whtr, salud metabolica, grasa visceral',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-relacion-cintura-cadera-altura' },
  openGraph: {
    title: 'Índices de Salud Abdominal: WHR y WHtR | Sporvit',
    description: 'Mide tu grasa visceral y evalúa tu salud metabólica con precisión científica.',
    url: 'https://sporvit.com/calculadoras/calculadora-relacion-cintura-cadera-altura',
    type: 'website',
    images: [{ url: '/og-whr-whtr.jpg', width: 1200, height: 630, alt: 'Calculadora Salud Abdominal Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora de Riesgo Cardiovascular Sporvit",
    "description": "Herramienta para el cálculo de perímetros antropométricos y estimación de riesgo metabólico.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo de Relación Cintura-Cadera (WHR)",
      "Cálculo de Relación Cintura-Altura (WHtR)",
      "Clasificación de riesgo según la OMS",
      "Interfaz clínica optimizada"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WHRCalculator />
    </>
  );
}