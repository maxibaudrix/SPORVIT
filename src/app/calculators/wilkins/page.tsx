import { Metadata } from 'next';
import WilksGLCalculator from './WilksGLCalculator';

export const metadata: Metadata = {
  title: 'Calculadora Wilks 2.0 y Puntos GL | Powerlifting | Sporvit',
  description: 'Calcula tus puntos Wilks 2.0 y GL. Compara tu fuerza relativa en powerlifting con las fórmulas oficiales de competición actualizadas.',
  keywords: 'calculadora wilks 2.0, puntos gl powerlifting, fuerza relativa pesas, coeficiente wilks vs gl, calculadora ipf points',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-wilks-2-puntos-gl' },
};

export default function Page() {
  return <WilksGLCalculator />;
}