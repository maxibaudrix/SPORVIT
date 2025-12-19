'use client';
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado persistente usando localStorage.
 *
 * @param key La clave bajo la cual se almacenará el valor en localStorage.
 * @param initialValue El valor inicial si no hay nada almacenado.
 * @returns [value, setValue] similar al useState.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Inicializar el estado de forma perezosa (lazy)
  const [value, setValue] = useState<T>(() => {
    // Solo intentar acceder a window/localStorage en el cliente
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parsear JSON almacenado o usar el valor inicial si no existe
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Manejo de errores (por ejemplo, si el JSON es inválido)
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Efecto para sincronizar el estado con localStorage cada vez que 'value' cambia
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Retornar el valor y el setter como lo haría useState
  return [value, setValue] as [T, typeof setValue];
}

export default useLocalStorage;