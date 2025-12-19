// src/lib/analytics.ts

/**
 * Wrapper para el servicio de Analytics (ej. PostHog, Google Analytics, Vercel Analytics).
 * Proporciona una interfaz simple y tipada para enviar eventos.
 */

// Usamos el objeto global 'window' para una integración simple del lado del cliente.
// En producción, se usaría un SDK específico.

interface EventProperties {
  [key: string]: any;
}

export const trackEvent = (name: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    try {
        // Placeholder: Si usas PostHog, sería window.posthog.capture(name, properties)
        // O si usas un script simple, podrías enviar un fetch.
        console.log(`[Analytics] Tracking event: ${name}`, properties);

        // Ejemplo para PostHog (asumiendo que está cargado globalmente):
        // if ((window as any).posthog) {
        //     (window as any).posthog.capture(name, properties);
        // }

    } catch (error) {
        console.error("Failed to track analytics event:", error);
    }
  }
};

export const identifyUser = (userId: string, properties?: EventProperties) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        try {
            console.log(`[Analytics] Identifying user: ${userId}`, properties);
            // Ejemplo para PostHog:
            // if ((window as any).posthog) {
            //     (window as any).posthog.identify(userId, properties);
            // }
        } catch (error) {
            console.error("Failed to identify user:", error);
        }
    }
};