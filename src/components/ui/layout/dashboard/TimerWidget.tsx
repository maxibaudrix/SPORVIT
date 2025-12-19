// components/ui/layout/dashboard/TimerWidget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerWidget() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      {/* Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold text-white tabular-nums">
          {formatTime(seconds)}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {isActive ? 'En progreso...' : 'Detenido'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={toggleTimer}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${isActive
              ? 'bg-slate-800 hover:bg-slate-700 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }
          `}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Iniciar
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          disabled={seconds === 0}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Info */}
      {seconds > 0 && (
        <div className="mt-3 p-2 bg-emerald-500/5 rounded-lg">
          <p className="text-xs text-emerald-400 text-center">
            {seconds >= 60 
              ? `Has entrenado ${Math.floor(seconds / 60)} minuto${Math.floor(seconds / 60) !== 1 ? 's' : ''}`
              : `${seconds} segundo${seconds !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}
    </div>
  );
}