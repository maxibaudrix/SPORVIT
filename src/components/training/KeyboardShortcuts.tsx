// src/components/training/KeyboardShortcuts.tsx
'use client';

import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const shortcuts = [
  { key: 'Espacio', action: 'Iniciar / Pausar' },
  { key: 'R', action: 'Reiniciar' },
  { key: 'S', action: 'Saltar fase' },
  { key: 'F', action: 'Pantalla completa' },
  { key: '?', action: 'Mostrar esta ayuda' },
  { key: 'Esc', action: 'Cerrar paneles' },
];

export default function KeyboardShortcuts({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 rounded-3xl border border-slate-700 p-8 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Keyboard className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Atajos de Teclado</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
            >
              <span className="text-slate-300">{shortcut.action}</span>
              <kbd className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono font-semibold text-emerald-400">
                {shortcut.key}
              </kbd>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-500 text-center">
          Presiona <kbd className="px-2 py-0.5 bg-slate-800 rounded">?</kbd> en cualquier momento para ver esta ayuda
        </p>
      </motion.div>
    </motion.div>
  );
}