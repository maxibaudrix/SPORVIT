import { Metadata } from 'next';
import FoodDatabaseCalculator from './FoodDatabaseCalculator';

export const metadata: Metadata = {
  title: 'Composición Nutricional de Alimentos | Base de Datos Completa | Sporvit',
  description: 'Busca la composición detallada de miles de alimentos. Consulta calorías, macros, vitaminas y minerales de forma instantánea.',
  keywords: 'base de datos alimentos, composicion nutricional, buscador de calorias, vitaminas alimentos, minerales comida, tabla nutricional csv',
  alternates: { canonical: 'https://sporvit.com/calculadoras/composicion-nutricional-de-tus-alimentos' },
};

export default function Page() {
  return <FoodDatabaseCalculator />;
}