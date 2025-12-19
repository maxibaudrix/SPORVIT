// src/lib/ratelimit.ts

/**
 * Placeholder para el servicio de Rate Limiting.
 * En una aplicación real, se usaría una solución como Upstash Redis Rate Limit, 
 * Vercel Edge Config o una base de datos.
 */

class RateLimiter {
    private store = new Map<string, number>();
    private windowMs: number;
    private maxRequests: number;

    constructor(windowMs = 60000, maxRequests = 10) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }

    /**
     * Verifica si una IP ha excedido el límite de peticiones.
     * @param key - Clave única (ej. IP del usuario o userId).
     * @returns {Promise<{success: boolean, limit: number, remaining: number}>}
     */
    async check(key: string): Promise<{ success: boolean, limit: number, remaining: number }> {
        const now = Date.now();
        const expirationTime = now - this.windowMs;

        // Limpieza de entradas viejas (simulación de expiración)
        this.store.forEach((timestamp, storedKey) => {
            if (timestamp < expirationTime) {
                this.store.delete(storedKey);
            }
        });

        // Contar requests en la ventana actual
        const requests = Array.from(this.store.entries())
            .filter(([k, timestamp]) => k.startsWith(key) && timestamp > expirationTime);
        
        const currentRequests = requests.length;

        if (currentRequests < this.maxRequests) {
            // Permitir y registrar nuevo request
            this.store.set(`${key}:${now}`, now);
            return { success: true, limit: this.maxRequests, remaining: this.maxRequests - currentRequests - 1 };
        } else {
            // Bloquear
            return { success: false, limit: this.maxRequests, remaining: 0 };
        }
    }
}

// Exportamos una instancia simple. En producción se usaría un back-end distribuido.
export const rateLimiter = new RateLimiter();