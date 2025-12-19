// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Definición de una función simple que crea y devuelve una nueva instancia de PrismaClient.
const prismaClientSingleton = () => {
  return new PrismaClient();
};
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Extiende el objeto global (globalThis) con una propiedad 'prisma' opcional.
// Esto es para almacenar la instancia del cliente en desarrollo.
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Utiliza la instancia global si existe (en desarrollo), o crea una nueva.

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
// En desarrollo, guarda la instancia en el objeto global para que el HMR la reutilice.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Exporta la instancia singleton.
export default prisma;