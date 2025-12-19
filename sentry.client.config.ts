// sentry.client.config.ts

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Ajusta el muestreo para controlar el volumen de eventos.
  tracesSampleRate: 0.1, 

  // Ajusta el muestreo para sesiones del usuario.
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0, 
});