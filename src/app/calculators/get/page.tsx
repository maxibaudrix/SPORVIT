import { Metadata } from 'next';
import CalorieRequirementCalculator from './CalorieRequirementCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Requerimiento Calórico | TDEE y Calorías | Sporvit',
  description: 'Calcula tus calorías diarias necesarias según tu objetivo: perder grasa, mantener peso o ganar masa muscular. Basada en la fórmula de Mifflin-St Jeor.',
  keywords: 'requerimiento calórico, calcular calorías diarias, TDEE, metabolismo basal, déficit calórico, superávit calórico, Mifflin-St Jeor',
  openGraph: {
    title: 'Calculadora de Requerimiento Calórico - Sporvit',
    description: 'Descubre cuántas calorías necesita tu cuerpo para alcanzar tus objetivos fitness.',
    type: 'website',
    url: 'https://sporvit.com/calculadoras/calculadora-de-requerimiento-calorico',
  },
  alternates: {
    canonical: 'https://sporvit.com/calculadoras/calculadora-de-requerimiento-calorico',
  },
};

export default function Page() {
  return <CalorieRequirementCalculator />;
}