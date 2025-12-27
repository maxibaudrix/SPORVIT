// src/components/training/TrainingTimer.tsx
'use client';

import React, { 
  useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense 
} from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Maximize, Minimize,
  Settings as SettingsIcon, Volume2, VolumeX, Keyboard, X
} from 'lucide-react';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAudioBeep } from '@/hooks/useAudioBeep';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components
const SettingsPanel = lazy(() => import('./SettingsPanel'));
const KeyboardShortcuts = lazy(() => import('./KeyboardShortcuts'));

// --- Types ---
type Mode = 'STOPWATCH' | 'HIIT' | 'TABATA' | 'EMOM' | 'AMRAP';

const PRESETS: Record<Mode, { work: number; rest: number; rounds: number }> = {
  STOPWATCH: { work: 0, rest: 0, rounds: 1 },
  TABATA: { work: 20, rest: 10, rounds: 8 },
  HIIT: { work: 30, rest: 15, rounds: 10 },
  EMOM: { work: 60, rest: 0, rounds: 10 },
  AMRAP: { work: 600, rest: 0, rounds: 1 },
};

interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highContrast: boolean;
}

interface Props {
  embedded?: boolean;
  onClose?: () => void;
}

export default function TrainingTimer({ embedded = false, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);
  const lastBeepSecondRef = useRef<number | null>(null);
  
  // Touch gestures
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [mode, setMode] = useState<Mode>('TABATA');
  const [config, setConfig] = useState(PRESETS['TABATA']);
  
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [round, setRound] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(PRESETS['TABATA'].work * 1000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const { active: wakeActive, request, release } = useWakeLock();
  const { initAudio, beepLow, beepHigh, beepRest } = useAudioBeep();

  const [settings, setSettings] = useLocalStorage<Settings>('sporvit.timer.settings', {
    soundEnabled: true,
    vibrationEnabled: true,
    highContrast: false,
  });

  // --- Analytics Tracking ---
  const trackEvent = useCallback((action: string, label?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: 'Timer',
        event_label: label,
      });
    }
  }, []);

  // --- Orientation Detection ---
  useEffect(() => {
    const handleResize = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Fullscreen Management ---
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        trackEvent('fullscreen_enter');
      } else {
        await document.exitFullscreen();
        trackEvent('fullscreen_exit');
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  // --- Haptic Feedback ---
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator && settings.vibrationEnabled) {
      navigator.vibrate(pattern);
    }
  }, [settings.vibrationEnabled]);

  // --- Phase Notifications ---
  const playPhaseStart = useCallback((newPhase: 'work' | 'rest') => {
    if (!settings.soundEnabled) return;
    if (newPhase === 'work') {
      beepHigh();
      vibrate([100, 50, 100]);
    } else {
      beepRest();
      vibrate([200]);
    }
  }, [settings.soundEnabled, beepHigh, beepRest, vibrate]);

  const playCountdown = useCallback(() => {
    if (settings.soundEnabled) {
      beepLow();
      vibrate(50);
    }
  }, [settings.soundEnabled, beepLow, vibrate]);

  // --- Mode Selection ---
  const selectMode = useCallback((m: Mode) => {
    if (running) return;
    setMode(m);
    setConfig(PRESETS[m]);
    setRound(1);
    setPhase('work');
    setRemainingMs(PRESETS[m].work * 1000);
    setElapsedMs(0);
    lastBeepSecondRef.current = null;
    trackEvent('mode_change', m);
  }, [running, trackEvent]);

  // --- Main Timer Loop ---
  useEffect(() => {
    if (!running) {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      return;
    }

    request();
    lastTimestampRef.current = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTimestampRef.current;
      lastTimestampRef.current = now;

      if (mode === 'STOPWATCH') {
        setElapsedMs(prev => prev + delta);
      } else {
        setElapsedMs(prev => prev + delta);
        setRemainingMs(prev => {
          const next = prev - delta;
          const secondsLeft = Math.ceil(next / 1000);

          // Countdown beeps
          if (secondsLeft <= 3 && secondsLeft > 0 && secondsLeft !== lastBeepSecondRef.current) {
            playCountdown();
            lastBeepSecondRef.current = secondsLeft;
          }

          if (next <= 0) {
            lastBeepSecondRef.current = null;
            
            if (phase === 'work') {
              if (config.rest > 0 && mode !== 'AMRAP') {
                setPhase('rest');
                playPhaseStart('rest');
                return config.rest * 1000;
              } else {
                if (round < config.rounds || mode === 'AMRAP') {
                  setRound(r => r + 1);
                  playPhaseStart('work');
                  return config.work * 1000;
                } else {
                  // Workout completed
                  setRunning(false);
                  trackEvent('workout_completed', `${mode}_${round}_rounds`);
                  vibrate([200, 100, 200, 100, 200]);
                  release();
                  return 0;
                }
              }
            } else {
              if (round < config.rounds) {
                setPhase('work');
                setRound(r => r + 1);
                playPhaseStart('work');
                return config.work * 1000;
              } else {
                setRunning(false);
                trackEvent('workout_completed', `${mode}_${round}_rounds`);
                release();
                return 0;
              }
            }
          }
          return next;
        });
      }
      tickRef.current = requestAnimationFrame(loop);
    };

    tickRef.current = requestAnimationFrame(loop);
    return () => { 
      if (tickRef.current) cancelAnimationFrame(tickRef.current); 
    };
  }, [running, mode, phase, config, round, request, release, playCountdown, playPhaseStart, trackEvent, vibrate]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyR':
          e.preventDefault();
          reset();
          break;
        case 'KeyS':
          e.preventDefault();
          skip();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Slash':
          if (e.shiftKey) {
            e.preventDefault();
            setShowKeyboardHelp(true);
          }
          break;
        case 'Escape':
          setShowKeyboardHelp(false);
          setShowSettings(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running]);

  // --- Touch Gestures ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    
    // Swipe threshold
    if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50) {
      if (deltaX > 0) {
        // Swipe right -> reset
        reset();
      } else {
        // Swipe left -> skip
        skip();
      }
    }
    
    touchStartRef.current = null;
  };

  // --- Controls ---
  const togglePlay = useCallback(() => {
    initAudio();
    const newRunning = !running;
    setRunning(newRunning);
    trackEvent(newRunning ? 'timer_start' : 'timer_pause', mode);
    vibrate(50);
  }, [running, initAudio, trackEvent, mode, vibrate]);
  
  const reset = useCallback(() => {
    setRunning(false);
    setElapsedMs(0);
    setRound(1);
    setPhase('work');
    setRemainingMs(mode === 'STOPWATCH' ? 0 : config.work * 1000);
    lastBeepSecondRef.current = null;
    release();
    trackEvent('timer_reset', mode);
    vibrate(100);
  }, [mode, config, release, trackEvent, vibrate]);

  const skip = useCallback(() => {
    if (mode === 'STOPWATCH') return;
    lastBeepSecondRef.current = null;
    
    if (phase === 'work' && config.rest > 0) {
      setPhase('rest');
      playPhaseStart('rest');
      setRemainingMs(config.rest * 1000);
    } else {
      setPhase('work');
      setRound(r => r + 1);
      playPhaseStart('work');
      setRemainingMs(config.work * 1000);
    }
    trackEvent('timer_skip', mode);
  }, [mode, phase, config, playPhaseStart, trackEvent]);

  // --- Formatting ---
  const formatTime = useCallback((ms: number) => {
    const totalSec = Math.ceil(Math.max(0, ms) / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  // --- Memoized Values ---
  const { progress, ringColor, textColor, labelColor } = useMemo(() => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const currentTotal = phase === 'work' ? config.work * 1000 : config.rest * 1000;
    
    const prog = mode === 'STOPWATCH' || currentTotal === 0
      ? 0
      : Math.min(1, Math.max(0, 1 - remainingMs / currentTotal));

    const isWork = phase === 'work';
    const ring = isWork ? '#10b981' : '#f97316';
    const text = isWork ? 'text-emerald-400' : 'text-orange-400';
    const label = isWork ? 'text-emerald-500/60' : 'text-orange-500/60';

    return {
      progress: prog,
      circumference,
      ringColor: ring,
      textColor: text,
      labelColor: label,
    };
  }, [phase, config, mode, remainingMs]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - progress);

  // --- Layout Classes ---
  const containerClasses = orientation === 'landscape' && !embedded
    ? 'flex-row items-center gap-8'
    : 'flex-col justify-center';

  return (
    <div
      ref={containerRef}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Temporizador ${mode}: ${formatTime(remainingMs)}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full min-h-screen flex p-4 ${containerClasses} bg-slate-950 text-white overflow-hidden transition-colors duration-500 ${settings.highContrast ? 'contrast-125' : ''}`}
    >
      {/* HEADER */}
      {!isFullscreen && !embedded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-slate-950/80 to-transparent"
        >
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(Object.keys(PRESETS) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => selectMode(m)}
                disabled={running}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  mode === m 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50'
                }`}
                aria-label={`Seleccionar modo ${m}`}
              >
                {m}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Atajos de teclado"
            >
              <Keyboard size={20} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Configuración"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* SETTINGS PANEL */}
      <AnimatePresence>
        {showSettings && !isFullscreen && (
          <Suspense fallback={<div className="absolute top-16 right-4 w-64 h-32 bg-slate-900 rounded-2xl animate-pulse" />}>
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              config={config}
              setConfig={setConfig}
              mode={mode}
              running={running}
              phase={phase}
              setRemainingMs={setRemainingMs}
              onClose={() => setShowSettings(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS MODAL */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <Suspense fallback={null}>
            <KeyboardShortcuts onClose={() => setShowKeyboardHelp(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* TIMER VISUAL */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-[80vmin] h-[80vmin] max-w-[600px] max-h-[600px]"
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full transform -rotate-90"
            style={{ willChange: 'transform' }}
          >
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              stroke="#1e293b" 
              strokeWidth="4" 
              fill="transparent" 
            />
            
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={ringColor}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-colors duration-300"
              style={{ willChange: 'stroke-dashoffset' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={formatTime(mode === 'STOPWATCH' ? elapsedMs : remainingMs)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className={`text-[18vmin] font-bold tabular-nums leading-none tracking-tight ${textColor} transition-colors duration-300`}
              >
                {mode === 'STOPWATCH' ? formatTime(elapsedMs) : formatTime(remainingMs)}
              </motion.span>
            </AnimatePresence>
            
            <div className={`mt-4 text-[4vmin] font-black uppercase tracking-widest ${labelColor} transition-colors duration-300`}>
              {mode === 'STOPWATCH' ? 'TIEMPO' : (phase === 'work' ? 'WORK' : 'REST')}
            </div>

            {mode !== 'STOPWATCH' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-[2.5vmin] text-slate-500 font-medium"
              >
                ROUND {round} <span className="text-slate-700">/</span> {config.rounds}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* CONTROLS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 w-full flex justify-center gap-6 transition-opacity duration-300 z-20 ${
          (running && isFullscreen) ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <button
          onClick={reset}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
          aria-label="Reiniciar cronómetro (R)"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={togglePlay}
          className={`w-24 h-24 flex items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 ${
            running ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-950 hover:bg-slate-200'
          }`}
          aria-label={running ? "Pausar (Espacio)" : "Iniciar (Espacio)"}
        >
          <AnimatePresence mode="wait">
            {running ? (
              <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Pause size={40} fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Play size={40} fill="currentColor" className="ml-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={skip}
          disabled={mode === 'STOPWATCH'}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Saltar fase (S)"
        >
          <SkipForward size={24} />
        </button>
        
        {!embedded && (
          <button
            onClick={toggleFullscreen}
            className="absolute right-6 bottom-10 md:static md:w-16 md:h-16 flex items-center justify-center rounded-full text-slate-500 hover:text-white transition-colors active:scale-95"
            aria-label={isFullscreen ? "Salir pantalla completa (F)" : "Pantalla completa (F)"}
          >
            {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
          </button>
        )}
      </motion.div>

      {/* Wake Lock Indicator */}
      {wakeActive && !embedded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 text-xs text-emerald-400 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Pantalla activa
        </motion.div>
      )}
    </div>
  );
}