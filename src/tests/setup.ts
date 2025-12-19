// src/tests/setup.ts
// Archivo de setup para Vitest.
// Aquí se pueden poner polyfills o mocks globales si es necesario.
import '@testing-library/jest-dom';

// Opcional: Mockear objetos que no existen en jsdom (ej. fetch)
// global.fetch = vi.fn();