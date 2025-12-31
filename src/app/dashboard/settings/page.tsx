'use client';

import { useState } from 'react';
import { AccountTabs } from '@/components/ui/layout/dashboard/AccountTabs';
import { Target, Shield, Bell, Save, Loader2, Globe, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <AccountTabs />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Configuración</h1>
          <p className="text-slate-400 mt-1">Personaliza tus objetivos y privacidad en Sporvit.</p>
        </header>

        <div className="grid gap-8">
          {/* Objetivos */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg transition-all hover:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Objetivos del Plan</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Objetivo Principal</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none">
                  <option value="cut">Pérdida de Grasa</option>
                  <option value="bulk">Ganancia Muscular</option>
                  <option value="maintain">Mantenimiento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Cambio Semanal</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none">
                  <option value="0.25">0.25 kg / semana</option>
                  <option value="0.5">0.5 kg / semana (Recomendado)</option>
                  <option value="1">1 kg / semana</option>
                </select>
              </div>
            </div>
          </section>

          {/* Preferencias */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Preferencias de la App</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-300">Unidades de peso</span>
                  <span className="text-emerald-500 font-bold uppercase">kg</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-300">Modo Oscuro</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
               </div>
            </div>
          </section>

          {/* Zona Peligrosa */}
          <section className="border border-red-900/30 bg-red-950/10 rounded-2xl p-6 transition-all hover:bg-red-950/20">
             <div className="flex items-center gap-3 mb-4 text-red-500">
                <Trash2 className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Zona Peligrosa</h2>
             </div>
             <p className="text-slate-400 text-sm mb-4">Una vez elimines tu cuenta, no hay vuelta atrás. Todos tus progresos de Sporvit se perderán.</p>
             <button className="text-red-500 hover:text-red-400 font-medium text-sm underline transition-colors">
                Eliminar mi cuenta definitivamente
             </button>
          </section>

          {/* Botón Guardar Flotante o al Final */}
          <div className="flex justify-end sticky bottom-8 pt-4">
            <button
              onClick={() => setSaving(true)}
              disabled={saving}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-emerald-500/30 active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}