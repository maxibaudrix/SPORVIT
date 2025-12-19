import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // ⬇️ CONFIGURACIÓN AÑADIDA PARA EVITAR FALLOS DE RUTA (ERR_INVALID_ARG_TYPE) ⬇️
    datasources: {
      db: {
        // La URL debe ser proporcionada aquí para el constructor en Next.js
        url: process.env.DATABASE_URL, 
      },
    },
    // ⬆️ FIN DE CONFIGURACIÓN AÑADIDA ⬆️
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;