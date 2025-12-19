// sentry.server.config.ts

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Ajusta el muestreo para controlar el volumen de eventos.
  tracesSampleRate: 0.1, 

  // Deshabilita Replays en el servidor.
  replaysOnErrorSampleRate: 0.0,
});