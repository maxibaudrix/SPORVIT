"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Zap, Calculator, Timer, TrendingUp, Info, Share2, ShieldAlert, 
  Code, Copy, Check, MessageCircle, Send, Mail, Gauge, Bike, Target, ListChecks
} from 'lucide-react';

export default function FTPCalculator() {
  const [method, setMethod] = useState<'20min' | 'ramp'>('20min');
  const [power, setPower] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [shareStatus, setShareStatus] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => { setCurrentUrl(typeof window !== 'undefined' ? window.location.href : ''); }, []);

  const calculateFTP = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(power);
    const w = parseFloat(weight);
    if (!p) return;

    const ftpValue = method === '20min' ? p * 0.95 : p * 0.75;
    const ratio = w ? (ftpValue / w).toFixed(2) : null;

    const zones = [
      { z: 'Z1', name: 'Recup. Activa', range: '< 55%', val: `< ${Math.round(ftpValue * 0.55)}W` },
      { z: 'Z2', name: 'Resistencia (Base)', range: '56-75%', val: `${Math.round(ftpValue * 0.56)}-${Math.round(ftpValue * 0.75)}W` },
      { z: 'Z3', name: 'Tempo', range: '76-90%', val: `${Math.round(ftpValue * 0.76)}-${Math.round(ftpValue * 0.90)}W` },
      { z: 'Z4', name: 'Umbral Lactato', range: '91-105%', val: `${Math.round(ftpValue * 0.91)}-${Math.round(ftpValue * 1.05)}W` },
      { z: 'Z5', name: 'VO2 Max', range: '106-120%', val: `${Math.round(ftpValue * 1.06)}-${Math.round(ftpValue * 1.20)}W` },
    ];

    setResult({ ftp: Math.round(ftpValue), ratio, zones });
  };

  const shareText = useMemo(() => {
    if (!result) return "";
    return `🚲 Mi FTP en Sporvit: ${result.ftp}W ${result.ratio ? `(${result.ratio} W/kg)` : ''}. ¡Define tus zonas aquí:`;
  }, [result]);

  const copyToClipboard = useCallback(async (text: string, type: 'embed' | 'share') => {
    await navigator.clipboard.writeText(text);
    if (type === 'embed') setCopyStatus(true); else setShareStatus(true);
    setTimeout(() => { setCopyStatus(false); setShareStatus(false); }, 2000);
  }, []);

  const embedSnippet = `<iframe src="${currentUrl}" width="100%" height="950px" frameborder="0" style="border-radius:24px; border:1px solid #1e293b;"></iframe>`;

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Bike className="w-3 h-3" /> Power Training Lab
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Estimador de FTP
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic text-center">
          "El FTP es la brújula de vatios que separa al ciclista del atleta."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        <section className="lg:col-span-7">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-8">
              <button type="button" onClick={() => setMethod('20min')} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all flex flex-col items-center gap-2 ${method === '20min' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Timer className="w-4 h-4" /> Test 20 min
              </button>
              <button type="button" onClick={() => setMethod('ramp')} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all flex flex-col items-center gap-2 ${method === 'ramp' ? 'bg-yellow-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <TrendingUp className="w-4 h-4" /> Test Rampa
              </button>
            </div>

            <form onSubmit={calculateFTP} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <Zap className="w-3 h-3 text-yellow-500" /> {method === '20min' ? 'Vatios Medios (20m)' : 'Vatios Máximos (Rampa)'}
                  </label>
                  <input type="number" value={power} onChange={(e) => setPower(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-yellow-500 font-black" placeholder="250" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                    <Target className="w-3 h-3 text-yellow-500" /> Peso Ciclista (kg)
                  </label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-6 px-6 text-4xl text-white outline-none focus:border-yellow-500 font-black" placeholder="75" />
                </div>
              </div>
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-tighter flex items-center justify-center gap-4 text-lg">
                <Gauge className="w-6 h-6" /> Calcular Mi FTP
              </button>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className={`${result ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none transition-all duration-1000'}`}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8 pb-6 border-b border-slate-800">
                <p className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Umbral de Potencia Funcional</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                  {result ? result.ftp : '--'} <span className="text-2xl text-slate-500">W</span>
                </div>
                {result?.ratio && <div className="text-xs font-black text-slate-500 mt-2 uppercase italic">Potencia Relativa: {result.ratio} W/kg</div>}
              </div>

              <div className="space-y-2 mb-8">
                {result?.zones.map((z: any) => (
                  <div key={z.z} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800 hover:border-yellow-500/30 transition-all group">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-yellow-500 uppercase">{z.z}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{z.name}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black text-white italic group-hover:text-yellow-400 transition-colors">{z.val}</span>
                        <div className="text-[8px] font-bold text-slate-600 uppercase">{z.range}</div>
                    </div>
                  </div>
                ))}
              </div>

              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-green-500 transition-all flex justify-center"><MessageCircle className="w-5 h-5" /></button>
                  <button type="button" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-blue-400 transition-all flex justify-center"><Send className="w-5 h-5" /></button>
                  <button type="button" onClick={() => copyToClipboard(shareText + " " + currentUrl, 'share')} className={`p-4 bg-slate-950 border rounded-2xl transition-all flex justify-center shadow-lg ${shareStatus ? 'border-yellow-500 text-yellow-500' : 'border-slate-800 text-slate-400'}`}>{shareStatus ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
                  <button type="button" onClick={() => window.location.href=`mailto:?subject=Mi FTP Sporvit&body=${shareText}`} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:text-amber-400 transition-all flex justify-center"><Mail className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] justify-center">
              <Code className="w-3 h-3 text-yellow-500" /> Inserta este Widget Ciclista
            </div>
            <textarea readOnly onClick={(e) => (e.target as HTMLTextAreaElement).select()} value={embedSnippet} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-yellow-400/50 focus:outline-none resize-none mb-3 cursor-pointer" />
            <button type="button" onClick={() => copyToClipboard(embedSnippet, 'embed')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black transition-all border border-slate-700">
              {copyStatus ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
              {copyStatus ? 'CÓDIGO COPIADO' : 'COPIAR CÓDIGO EMBED'}
            </button>
          </div>
        </aside>
      </div>

      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Zap className="w-8 h-8 text-yellow-500" /> El FTP: La Métrica Reina del Ciclismo Moderno
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                El **FTP** o *Functional Threshold Power* se define como la potencia media más alta que un ciclista puede mantener de forma teórica durante una hora sin fatigarse exponencialmente. Es, en esencia, la medida de tu estado de forma aeróbico y la base sobre la cual se calculan todas las zonas de intensidad para el entrenamiento por vatios.
              </p>
              <p>
                ¿Por qué es superior a la frecuencia cardíaca? Porque los vatios son una medida de **trabajo absoluto**, mientras que el pulso es una **respuesta fisiológica** que puede verse alterada por el calor, el estrés o el descanso. Nuestra calculadora de Sporvit implementa los dos métodos de campo más rigurosos: el **Test de 20 minutos de Hunter Allen** y el **Test de Rampa**.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-yellow-500 italic mb-4 uppercase text-center">Protocolos del Test</h3>
              {[
                { t: "Test de 20 Minutos", d: "Nada al máximo constante por 20 min. Tu FTP es el 95% de la media obtenida." },
                { t: "Test de Rampa", d: "Sube 20W cada minuto hasta el fallo. Tu FTP es el 75% del último minuto completado." },
                { t: "Zonas de Coggan", d: "Sistema de 7 niveles para entrenar resistencia, umbral y potencia aeróbica." },
                { t: "Pérdida de Forma", d: "El FTP cae si no se estimula. Se recomienda re-testear cada 6-8 semanas." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}