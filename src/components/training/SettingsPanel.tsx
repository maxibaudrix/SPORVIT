// src/components/training/SettingsPanel.tsx
'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Vibrate, Contrast, X } from 'lucide-react';

interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  highContrast: boolean;
}

interface Config {
  work: number;
  rest: number;
  rounds: number;
}

interface Props {
  settings: Settings;
  setSettings: (setter: (s: Settings) => Settings) => void;
  config: Config;
  setConfig: (setter: (c: Config) => Config) => void;
  mode: string;
  running: boolean;
  phase: 'work' | 'rest';
  setRemainingMs: (ms: number) => void;
  onClose: () => void;
}

export default function SettingsPanel({
  settings,
  setSettings,
  config,
  setConfig,
  mode,
  running,
  phase,
  setRemainingMs,
  onClose,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="absolute top-16 right-4 z-30 bg-slate-900 border border-slate-700 p-6 rounded-2xl w-80 shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Configuración</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Cerrar configuración"
        >
          <X size={20} />
        </button>
      </div>

      {/* Toggles */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            {settings.soundEnabled ? (
              <Volume2 className="text-emerald-400" size={18} />
            ) : (
              <VolumeX className="text-slate-500" size={18} />
            )}
            Sonido
          </label>
          <Switch
            checked={settings.soundEnabled}
            onChange={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <Vibrate className={settings.vibrationEnabled ? 'text-emerald-400' : 'text-slate-500'} size={18} />
            Vibración
          </label>
          <Switch
            checked={settings.vibrationEnabled}
            onChange={() => setSettings(s => ({ ...s, vibrationEnabled: !s.vibrationEnabled }))}
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <Contrast className={settings.highContrast ? 'text-emerald-400' : 'text-slate-500'} size={18} />
            Alto contraste
          </label>
          <Switch
            checked={settings.highContrast}
            onChange={() => setSettings(s => ({ ...s, highContrast: !s.highContrast }))}
          />
        </div>
      </div>

      {/* Manual Config */}
      {mode !== 'STOPWATCH' && (
        <>
          <div className="border-t border-slate-800 pt-4 mb-4">
            <h4 className="text-sm font-semibold text-slate-400 mb-3">Configuración manual</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Trabajo (s)
                </label>
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={config.work}
                  onChange={e => {
                    const v = Math.max(5, Math.min(600, +e.target.value));
                    setConfig(c => ({ ...c, work: v }));
                    if (!running && phase === 'work') setRemainingMs(v * 1000);
                  }}
                  disabled={running}
                  className="w-full bg-slate-800 text-center rounded-lg py-2 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Descanso (s)
                </label>
                <input
                  type="number"
                  min={0}
                  max={300}
                  value={config.rest}
                  onChange={e => {
                    const v = Math.max(0, Math.min(300, +e.target.value));
                    setConfig(c => ({ ...c, rest: v }));
                    if (!running && phase === 'rest') setRemainingMs(v * 1000);
                  }}
                  disabled={running}
                  className="w-full bg-slate-800 text-center rounded-lg py-2 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">
                  Rondas
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={config.rounds}
                  onChange={e => {
                    const v = Math.max(1, Math.min(50, +e.target.value));
                    setConfig(c => ({ ...c, rounds: v }));
                  }}
                  disabled={running}
                  className="w-full bg-slate-800 text-center rounded-lg py-2 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {running && (
            <p className="text-xs text-slate-500 italic">
              Pausa el timer para editar la configuración
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}

// Switch Component
function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-slate-700'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
      />
    </button>
  );
}