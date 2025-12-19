'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Maximize, Minimize,
  Settings as SettingsIcon, Volume2, VolumeX
} from 'lucide-react';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAudioBeep } from '@/hooks/useAudioBeep';

// --- Tipos y Constantes ---
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
  
  // Para evitar beeps repetidos en el mismo segundo
  const lastBeepSecondRef = useRef<number | null>(null);

  const [mode, setMode] = useState<Mode>('TABATA');
  const [config, setConfig] = useState(PRESETS['TABATA']);
  
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [round, setRound] = useState(1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(PRESETS['TABATA'].work * 1000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { active: wakeActive, request, release } = useWakeLock();
  
  // Usamos el hook de audio mejorado
  const { initAudio, beepLow, beepHigh, beepRest } = useAudioBeep();

  const [settings, setSettings] = useLocalStorage<Settings>('Sporvit.timer.settings', {
    soundEnabled: true,
    vibrationEnabled: true,
    highContrast: false,
  });

  // --- Fullscreen ---
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // --- Selección de Modo ---
  const selectMode = (m: Mode) => {
    if (running) return;
    setMode(m);
    setConfig(PRESETS[m]);
    setRound(1);
    setPhase('work');
    setRemainingMs(PRESETS[m].work * 1000);
    setElapsedMs(0);
    lastBeepSecondRef.current = null;
  };

  // --- Helpers de Notificación ---
  const playPhaseStart = useCallback((newPhase: 'work' | 'rest') => {
    if (!settings.soundEnabled) return;
    if (newPhase === 'work') beepHigh();
    else beepRest();
  }, [settings.soundEnabled, beepHigh, beepRest]);

  const playCountdown = useCallback(() => {
    if (settings.soundEnabled) beepLow();
  }, [settings.soundEnabled, beepLow]);

  // --- Loop Principal ---
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
        setRemainingMs(prev => {
          const next = prev - delta;
          const secondsLeft = Math.ceil(next / 1000);

          // Lógica de Countdown (3, 2, 1)
          if (secondsLeft <= 3 && secondsLeft > 0 && secondsLeft !== lastBeepSecondRef.current) {
            playCountdown();
            lastBeepSecondRef.current = secondsLeft;
          }

          if (next <= 0) {
            // CAMBIO DE FASE
            lastBeepSecondRef.current = null; // Reset para el siguiente ciclo
            
            if (phase === 'work') {
              // Work -> Rest (si hay descanso)
              if (config.rest > 0 && mode !== 'AMRAP') {
                 setPhase('rest');
                 playPhaseStart('rest');
                 return config.rest * 1000;
              } else {
                // Work -> Work (Siguiente ronda directa)
                if (round < config.rounds || mode === 'AMRAP') {
                  setRound(r => r + 1);
                  playPhaseStart('work');
                  return config.work * 1000;
                } else {
                  // FIN
                  setRunning(false);
                  setPhase('work');
                  release();
                  return 0;
                }
              }
            } else {
              // Rest -> Work
              if (round < config.rounds) {
                setPhase('work');
                setRound(r => r + 1);
                playPhaseStart('work');
                return config.work * 1000;
              } else {
                setRunning(false);
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
    return () => { if (tickRef.current) cancelAnimationFrame(tickRef.current); };
  }, [running, mode, phase, config, round, request, release, playCountdown, playPhaseStart]);


  // --- Handlers ---
  const togglePlay = () => {
    initAudio(); // Habilitar audio context en click
    setRunning(r => !r);
  };
  
  const reset = () => {
    setRunning(false);
    setElapsedMs(0);
    setRound(1);
    setPhase('work');
    setRemainingMs(mode === 'STOPWATCH' ? 0 : config.work * 1000);
    lastBeepSecondRef.current = null;
    release();
  };

  const skip = () => {
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
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(Math.max(0, ms) / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Render Variables ---
  const radius = 45; 
  const circumference = 2 * Math.PI * radius;
  const currentTotal = phase === 'work' ? config.work * 1000 : config.rest * 1000;
  
  // LÓGICA DE PROGRESO: 0 (vacío) -> 1 (lleno)
  const progress =
  mode === 'STOPWATCH' || currentTotal === 0
    ? 0
    : Math.min(1, Math.max(0, 1 - remainingMs / currentTotal));

  
  // Para llenar el círculo, reducimos el offset desde 'circumference' hasta '0'
  const strokeOffset = circumference * (1 - progress);

  // Colores dinámicos
  const isWork = phase === 'work';
  // Texto y Anillo: Verde (Emerald) para Work, Naranja (Orange) para Rest
  const ringColor = isWork ? '#10b981' : '#f97316'; 
  const textColor = isWork ? 'text-emerald-400' : 'text-orange-400';
  const labelColor = isWork ? 'text-emerald-500/60' : 'text-orange-500/60';

  // FULL SCREEN
  return (
    <div
      ref={containerRef}
      className={`relative w-full flex p-4 flex-col bg-slate-950 text-white overflow-hidden transition-colors duration-500 ${settings.highContrast ? 'contrast-125' : ''}`}
    >
      {/* HEADER */}
      {!isFullscreen && (
        <div className="absolute top- left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-slate-950/80 to-transparent">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(Object.keys(PRESETS) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => selectMode(m)}
                disabled={running}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${mode === m ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 ml-2">
            <SettingsIcon size={20} />
          </button>
        </div>
      )}

      {/* SETTINGS (Omitted for brevity, same as before) */}
      {showSettings && !isFullscreen && (
        <div className="absolute top-16 right-4 z-30 bg-slate-900 border border-slate-700 p-4 rounded-2xl w-64 shadow-xl">
             <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-400">Sonido</span>
              <button onClick={() => setSettings(s => ({...s, soundEnabled: !s.soundEnabled}))}>
                {settings.soundEnabled ? <Volume2 className="text-emerald-400" size={20}/> : <VolumeX className="text-slate-500" size={20}/>}
              </button>
            </div>
             {/* Inputs manuales */}
             {mode !== 'STOPWATCH' && (
              <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase">Work</label>
                    <input type="number" className="w-full bg-slate-800 text-center rounded py-1 text-sm" 
                           value={config.work} onChange={e => {
                             const v = +e.target.value; 
                             setConfig(c => ({...c, work: v}));
                             if(!running && phase==='work') setRemainingMs(v*1000);
                           }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase">Rest</label>
                    <input type="number" className="w-full bg-slate-800 text-center rounded py-1 text-sm" 
                           value={config.rest} onChange={e => {
                             const v = +e.target.value;
                             setConfig(c => ({...c, rest: v}));
                             if(!running && phase==='rest') setRemainingMs(v*1000);
                           }} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase">Rounds</label>
                    <input type="number" className="w-full bg-slate-800 text-center rounded py-1 text-sm" 
                           value={config.rounds} onChange={e => setConfig(c => ({...c, rounds: +e.target.value}))} />
                  </div>
              </div>
             )}
        </div>
      )}

      {/* TIMER VISUAL */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-[80vmin] h-[80vmin] max-w-[600px] max-h-[600px]">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle cx="50" cy="50" r={radius} stroke="#1e293b" strokeWidth="4" fill="transparent" />
            
            {/* Progress Ring (Filling Up) */}
            <circle
              cx="50" cy="50" r={radius}
              stroke={ringColor}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset} // De circumference (vacío) a 0 (lleno)
              strokeLinecap="round"
              className="will-change-[stroke-dashoffset]"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
             <span className={`text-[18vmin] font-bold tabular-nums leading-none tracking-tight ${textColor} transition-colors duration-300`}>
                {mode === 'STOPWATCH' ? formatTime(elapsedMs) : formatTime(remainingMs)}
             </span>
             
             <div className={`mt-4 text-[4vmin] font-black uppercase tracking-widest ${labelColor} transition-colors duration-300`}>
                {mode === 'STOPWATCH' ? 'TIEMPO' : (phase === 'work' ? 'WORK' : 'REST')}
             </div>

             {mode !== 'STOPWATCH' && (
               <div className="mt-2 text-[2.5vmin] text-slate-500 font-medium">
                  ROUND {round} <span className="text-slate-700">/</span> {config.rounds}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className={`p-8 w-full flex justify-center gap-6 transition-opacity duration-300 z-20 ${(running && isFullscreen) ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <button onClick={reset} className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all">
          <RotateCcw size={24} />
        </button>

        <button onClick={togglePlay} className={`w-24 h-24 flex items-center justify-center rounded-full shadow-2xl transition-transform active:scale-95 ${running ? 'bg-slate-800 text-white' : 'bg-white text-slate-950'}`}>
          {running ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
        </button>

        <button onClick={skip} className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all">
          <SkipForward size={24} />
        </button>
        
        <button onClick={toggleFullscreen} className="absolute right-6 bottom-10 md:static md:w-16 md:h-16 flex items-center justify-center rounded-full text-slate-500 hover:text-white transition-colors">
          {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
        </button>
      </div>
    </div>
  );
}