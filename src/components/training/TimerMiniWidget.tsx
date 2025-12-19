import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Zap, Timer as TimerIcon,
  Maximize, Minimize, Volume2, VolumeX, Vibrate, Contrast, Trophy, History

} from 'lucide-react';
function TimerWidget({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'STOPWATCH' | 'TABATA' | 'HIIT'>('STOPWATCH');
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <time className="w-5 h-5 text-emerald-400" />
          <span className="font-bold">Cronómetro</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {/* Selector de modo */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(['STOPWATCH', 'TABATA', 'HIIT'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === m
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold mb-2">
          {Math.floor(time / 60).toString().padStart(2, '0')}:
          {(time % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-slate-400">{mode}</div>
      </div>

      {/* Controles */}
      <div className="flex gap-2">
        <button
          onClick={() => setRunning(!running)}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold transition-all"
        >
          {running ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={() => setTime(0)}
          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
        >
          Reset
        </button>
      </div>

      {/* Link a versión completa */}
      <a
        href="/timer"
        className="block mt-4 text-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        Abrir versión completa →
      </a>
    </div>
  );
}