"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, User, Calculator, Target, ShieldAlert, 
  Dumbbell, Share2, Code, Copy, Check, MessageCircle, Send, Mail
} from 'lucide-react';

export default function WilksGLCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bodyWeight, setBodyWeight] = useState('');
  const [totalLifted, setTotalLifted] = useState('');
  const [results, setResults] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculatePoints = (e: React.FormEvent) => {
    e.preventDefault();
    const bw = parseFloat(bodyWeight);
    const total = parseFloat(totalLifted);
    if (!bw || !total) return;

    // Fórmulas simplificadas para entorno competitivo
    const wilks2 = (total * (600 / (50 + (bw * 0.85)))).toFixed(2);
    const glPoints = (total * (100 / (bw + 20))).toFixed(2);

    setResults({ wilks2, glPoints });
  };

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; border:1px solid #1e293b;"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Trophy className="w-3 h-3" /> Competition Standards
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Wilks 2.0 & GL Points
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "Compara tu fuerza absoluta contra el resto del mundo de forma justa."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-8">
                <button type="button" onClick={() => setGender('male')} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${gender === 'male' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Hombre</button>
                <button type="button" onClick={() => setGender('female')} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${gender === 'female' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Mujer</button>
            </div>

            <form onSubmit={calculatePoints} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Peso Corporal (kg)</label>
                  <input type="number" step="0.1" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-rose-500" placeholder="82.5" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Total Levantado (kg)</label>
                  <input type="number" step="0.5" value={totalLifted} onChange={(e) => setTotalLifted(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white font-bold outline-none focus:border-rose-500" placeholder="500" />
                </div>
              </div>

              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Dumbbell className="w-6 h-6" /> Calcular Coeficientes
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-4">
          <div className={`${results ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center mb-4">
                <p className="text-rose-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Wilks 2.0</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">{results?.wilks2 || '--'}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
                <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">GL Points (IPF)</p>
                <div className="text-6xl font-black text-white italic tracking-tighter">{results?.glPoints || '--'}</div>
              </div>
          </div>
        </aside>
      </div>
    </div>
  );
}