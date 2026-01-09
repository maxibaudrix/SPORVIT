// src/app/(public)/login/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Sporvit - Tu Coach de Fitness Personal',
  description: 'Accede a tu cuenta de Sporvit para continuar con tu entrenamiento personalizado, seguimiento de progreso y planes de nutrición.',
  keywords: 'login, iniciar sesión, fitness, entrenamiento personal, Sporvit, entrenamiento online',
  authors: [{ name: 'Sporvit' }],
  openGraph: {
    title: 'Iniciar Sesión en Sporvit',
    description: 'Accede a tu cuenta para continuar tu viaje fitness',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'Iniciar Sesión en Sporvit',
    description: 'Accede a tu cuenta para continuar tu viaje fitness',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
