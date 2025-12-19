// src/hooks/useWakeLock.ts
'use client';
import { useState, useEffect, useRef } from 'react';

export function useWakeLock() {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const lockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setSupported('wakeLock' in navigator);
  }, []);

  const request = async () => {
    if (!supported || active) return;
    try {
      lockRef.current = await navigator.wakeLock.request('screen');
      setActive(true);
      
      lockRef.current.addEventListener('release', () => {
        setActive(false);
      });
      
      console.log('Wake Lock activado');
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  const release = async () => {
    if (lockRef.current) {
      await lockRef.current.release();
      lockRef.current = null;
      setActive(false);
      console.log('Wake Lock liberado');
    }
  };

  // Auto-release on unmount
  useEffect(() => {
    return () => {
      if (lockRef.current) {
        lockRef.current.release();
      }
    };
  }, []);

  return { supported, active, request, release };
}