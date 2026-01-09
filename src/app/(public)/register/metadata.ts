// src/app/(public)/register/metadata.ts
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrarse | Sporvit - Comienza Tu Transformación Fitness',
  description: 'Crea tu cuenta gratuita en Sporvit y accede a entrenamientos personalizados, planes de nutrición y seguimiento de progreso. Únete a miles de personas transformando su salud.',
  keywords: 'registro, crear cuenta, fitness, entrenamiento personal, Sporvit, app fitness, entrenamiento online, nutrición',
  authors: [{ name: 'Sporvit' }],
  openGraph: {
    title: 'Únete a Sporvit - Tu Coach de Fitness Personal',
    description: 'Crea tu cuenta gratuita y comienza tu transformación fitness hoy',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'Únete a Sporvit',
    description: 'Crea tu cuenta gratuita y comienza tu transformación fitness hoy',
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
