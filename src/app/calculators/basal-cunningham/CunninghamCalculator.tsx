"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Flame, User, Calculator, Activity, ShieldAlert, 
  Dumbbell, Share2, Code, Copy, Check, MessageCircle, Send, Mail, HeartPulse
} from 'lucide-react';

export default function CunninghamCalculator() {
  const [lbm, setLbm] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateCunningham = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(lbm);
    if (!val) return;
    const bmr = 500 + (22 * val);
    setResult(Math.round(bmr));
  };

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="900px" frameborder="0" style="border-radius:24px; border:1px solid #1e293b;"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Dumbbell className="w-3 h-3" /> Nutrición Avanzada
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Fórmula de Cunningham
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "La precisión metabólica que los atletas de fuerza necesitan."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            <form onSubmit={calculateCunningham} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-indigo-400" /> Masa Libre de Grasa (LBM en kg)
                </label>
                <input type="number" step="0.1" value={lbm} onChange={(e) => setLbm(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-3xl text-white outline-none focus:border-indigo-500 font-black" placeholder="65.5" />
                <p className="text-[9px] text-slate-600 font-bold italic">Calcula tu peso total menos tu masa grasa.</p>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Calculator className="w-6 h-6" /> Calcular RMR
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5">
           <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Gasto en Reposo Estimado</p>
              <div className="text-7xl font-black text-white italic tracking-tighter mb-4">
                {result || '--'} <span className="text-2xl text-slate-500">kcal</span>
              </div>
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3 text-left">
                <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0" />
                <p className="text-[10px] text-slate-500 font-bold italic">Cunningham es más preciso que Harris-Benedict para atletas con masa muscular por encima del promedio.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}