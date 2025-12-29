"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { 
  Search, Calculator, Info, Code, Copy, Check, MessageCircle, Send, Mail, 
  ChevronDown, Flame, Beef, Cookie, Droplets, Zap, Filter, Microscope
} from 'lucide-react';

export default function FoodDatabaseCalculator() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [weight, setWeight] = useState(100);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState(false);

  // 1. Cargar la base de datos CSV
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/Alimentos.csv'); // Asegúrate de poner el CSV en public/data/
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);
        
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error cargando el CSV:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Filtrar alimentos por búsqueda
  const filteredFoods = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return data.filter(food => 
      food["Descripción del alimento principal"]?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [searchTerm, data]);

  // 3. Cálculos proporcionales al peso
  const calc = (value: any) => {
    if (!value || isNaN(value)) return 0;
    return ((value * weight) / 100).toFixed(1);
  };

  return (
    <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 max-w-6xl">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Microscope className="w-3 h-3" /> Análisis Molecular de Alimentos
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent italic uppercase tracking-tighter">
          Composición Nutricional
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed italic">
          "Conoce exactamente qué contiene tu comida. Ciencia aplicada a tu plato."
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-20">
        {/* BUSCADOR */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca un alimento (ej. Pollo, Abulón, Aceite...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-12 pr-6 text-white font-bold outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-500 animate-pulse font-black uppercase text-xs">Cargando base de datos...</div>
            ) : (
              <div className="space-y-2">
                {filteredFoods.map((food, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedFood(food); setSearchTerm(''); }}
                    className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex justify-between items-center group"
                  >
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">{food["Descripción del alimento principal"]}</span>
                    <ChevronDown className="w-4 h-4 text-slate-600 -rotate-90" />
                  </button>
                ))}
                {searchTerm.length >= 2 && filteredFoods.length === 0 && (
                  <div className="text-center py-6 text-slate-600 italic text-sm">No se encontraron resultados</div>
                )}
              </div>
            )}
          </div>

          {selectedFood && (
            <div className="bg-slate-950 border border-emerald-500/20 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white italic uppercase">{selectedFood["Descripción del alimento principal"]}</h3>
                <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                   <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-16 bg-transparent text-emerald-500 font-black text-right outline-none"
                   />
                   <span className="text-[10px] font-black text-slate-500">GRAMOS</span>
                </div>
              </div>

              {/* GRID DE MACROS PRINCIPALES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Energía', val: calc(selectedFood["Energía (kcal)"]), unit: 'kcal', icon: Flame, color: 'text-orange-500' },
                  { label: 'Proteína', val: calc(selectedFood["Proteína (g)"]), unit: 'g', icon: Beef, color: 'text-red-500' },
                  { label: 'Carbohidratos', val: calc(selectedFood["Carbohidratos (g)"]), unit: 'g', icon: Cookie, color: 'text-emerald-500' },
                  { label: 'Grasa Total', val: calc(selectedFood["Grasa total (g)"]), unit: 'g', icon: Droplets, color: 'text-yellow-500' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                    <item.icon className={`w-4 h-4 ${item.color} mb-2`} />
                    <div className="text-[9px] font-black text-slate-500 uppercase">{item.label}</div>
                    <div className="text-xl font-black text-white italic">{item.val} <span className="text-[10px] text-slate-600">{item.unit}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* DETALLE EXTENDIDO */}
        <aside className="lg:col-span-5 space-y-6">
          {selectedFood ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl h-full">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Análisis de Micronutrientes</h4>
              
              <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                <div className="space-y-4">
                  <h5 className="text-[9px] font-black text-slate-500 uppercase">Minerales</h5>
                  {[
                    { l: 'Calcio', v: selectedFood["Calcio (mg)"], u: 'mg' },
                    { l: 'Hierro', v: selectedFood["Hierro\n(mg)"], u: 'mg' },
                    { l: 'Magnesio', v: selectedFood["Magnesio (mg)"], u: 'mg' },
                    { l: 'Sodio', v: selectedFood["Sodio (mg)"], u: 'mg' },
                    { l: 'Potasio', v: selectedFood["Potasio (mg)"], u: 'mg' },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-xs text-slate-400">{m.l}</span>
                      <span className="text-xs font-bold text-white">{calc(m.v)} {m.u}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  <h5 className="text-[9px] font-black text-slate-500 uppercase">Vitaminas</h5>
                  {[
                    { l: 'Vitamina C', v: selectedFood["Vitamina C (mg)"], u: 'mg' },
                    { l: 'Vitamina B-12', v: selectedFood["Vitamina B-12 (mcg)"], u: 'mcg' },
                    { l: 'Vitamina D', v: selectedFood["Vitamina D (D2 + D3) (mcg)"], u: 'mcg' },
                    { l: 'Retinol', v: selectedFood["Retinol (mcg)"], u: 'mcg' },
                  ].map((v, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-xs text-slate-400">{v.l}</span>
                      <span className="text-xs font-bold text-white">{calc(v.v)} {v.u}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full">
              <Filter className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm italic">Busca y selecciona un alimento para ver su análisis molecular detallado</p>
            </div>
          )}
        </aside>
      </div>

      {/* ARTÍCULO SEO */}
      <article className="prose prose-invert prose-slate max-w-none space-y-16 mt-20">
        <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-8 md:p-12">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-4">
            <Microscope className="w-8 h-8 text-emerald-500" /> Más allá de la caloría: La importancia de la Composición
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg text-justify">
              <p>
                Entender la **composición nutricional** de los alimentos es la piedra angular de cualquier estrategia de salud avanzada. Mientras que el conteo de calorías nos ayuda a gestionar el balance energético, es el desglose de macronutrientes y micronutrientes lo que dicta la respuesta hormonal, la recuperación muscular y el bienestar sistémico.
              </p>
              <p>
                Un alimento no es solo "energía"; es información para tus células. Nuestra calculadora utiliza una base de datos exhaustiva para revelarte no solo cuántas grasas contiene un alimento, sino su perfil de **ácidos grasos saturados, monoinsaturados y poliinsaturados**. Esta distinción es crítica para quienes buscan optimizar su perfil lipídico y reducir la inflamación crónica.
              </p>
            </div>
            <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-emerald-500 italic mb-4 uppercase">¿Qué estamos analizando?</h3>
              {[
                { t: "Vitaminas y Minerales", d: "Cofactores esenciales para la producción de energía y salud ósea." },
                { t: "Perfil Lipídico", d: "Desglose de grasas para una salud cardiovascular óptima." },
                { t: "Densidad Nutricional", d: "Relación entre nutrientes y volumen de calorías." },
                { t: "Hidratación", d: "Contenido de agua intrínseca en alimentos frescos." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <div className="font-black text-xs text-white uppercase">{item.t}</div>
                  <div className="text-[10px] text-slate-500 font-bold">{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[40px] p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Toma el control total de tu Nutrición</h2>
          <p className="text-slate-400 leading-relaxed mb-8 text-lg text-justify">
            La información es poder. Al conocer la composición detallada de lo que comes, dejas de depender de suposiciones y empiezas a tomar decisiones basadas en datos biológicos reales. Ya sea que estés ajustando tus electrolitos para una maratón o controlando tus azúcares totales, esta base de datos es tu laboratorio personal. En Sporvit, abogamos por la transparencia nutricional para que cada comida sea un paso hacia tu máximo rendimiento.
          </p>
        </section>
      </article>
    </div>
  );
}