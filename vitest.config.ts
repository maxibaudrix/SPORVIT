// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configuración para simular el entorno de navegador (jsdom)
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    // Ignorar tests dentro de node_modules
    exclude: ['**/node_modules/**', '**/dist/**'],
    // Recoge cobertura de test
    coverage: {
        provider: 'v8', // o 'istanbul'
        reporter: ['text', 'json', 'html'],
        include: ['src/utils/**'],
        exclude: ['src/utils/cn.ts'], // Excluir utilidades simples sin lógica
    }
  },
});