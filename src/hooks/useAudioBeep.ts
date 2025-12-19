// src/hooks/useAudioBeep.ts
'use client';
import { useRef, useCallback } from 'react';

export function useAudioBeep() {
  const ctxRef = useRef<AudioContext | null>(null);

  // Inicializar contexto (importante para navegadores que bloquean audio)
  const initAudio = useCallback(() => {
    if (!ctxRef.current) {
      // @ts-ignore - Safari support
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, startTime = 0) => {
    if (!ctxRef.current) initAudio();
    const ctx = ctxRef.current!;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Envelope para evitar "clicks" al inicio/final
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration + 0.1);
  }, [initAudio]);

  // Sonido corto (3... 2... 1...)
  const beepLow = useCallback(() => playTone(600, 'sine', 0.15), [playTone]);

  // Sonido agudo (GO! / Work)
  const beepHigh = useCallback(() => {
    playTone(880, 'sine', 0.1); // Tono principal
    playTone(1200, 'sine', 0.1, 0.1); // Pequeño eco agudo
  }, [playTone]);

  // Sonido grave (Rest)
  const beepRest = useCallback(() => {
    playTone(400, 'triangle', 0.3); // Tono más "sucio" y grave
  }, [playTone]);

  // Secuencia 3-2-1
  const countdown = useCallback(() => {
    playTone(600, 'sine', 0.1, 0);   // 3
    playTone(600, 'sine', 0.1, 1);   // 2 (1 seg después)
    playTone(600, 'sine', 0.1, 2);   // 1 (2 seg después)
  }, [playTone]);

  return { initAudio, beepLow, beepHigh, beepRest };
}