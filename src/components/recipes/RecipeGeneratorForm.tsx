'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2, Target, Flame, ChefHat } from 'lucide-react';
import type { RecipeCategory, FitnessGoals } from '@/types/fitness-recipe';

interface RecipeGeneratorFormProps {
  onGenerate: (data: {
    ingredientes: string[];
    categoria: RecipeCategory;
    objetivos: FitnessGoals;
    porciones: number;
  }) => void;
  isGenerating: boolean;
}

const CATEGORIAS: { value: RecipeCategory; label: string }[] = [
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
  { value: 'pre-entreno', label: 'Pre-entreno' },
  { value: 'post-entreno', label: 'Post-entreno' },
];

const OBJETIVOS = [
  { value: 'perder_grasa', label: 'Perder Grasa', icon: Flame },
  { value: 'ganar_musculo', label: 'Ganar Músculo', icon: Target },
  { value: 'mantener', label: 'Mantener', icon: ChefHat },
  { value: 'rendimiento', label: 'Rendimiento', icon: Target },
];

const RESTRICCIONES_DIETETICAS = [
  'Vegetariano',
  'Vegano',
  'Sin Gluten',
  'Sin Lactosa',
  'Cetogénica',
  'Paleo',
  'Low Carb',
];

export function RecipeGeneratorForm({ onGenerate, isGenerating }: RecipeGeneratorFormProps) {
  const [ingredientes, setIngredientes] = useState<string[]>([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [categoria, setCategoria] = useState<RecipeCategory>('almuerzo');
  const [objetivo, setObjetivo] = useState<'perder_grasa' | 'ganar_musculo' | 'mantener' | 'rendimiento'>('ganar_musculo');
  const [porciones, setPorciones] = useState(1);
  const [restricciones, setRestricciones] = useState<string[]>([]);
  const [alergias, setAlergias] = useState<string[]>([]);
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [calorias, setCalorias] = useState<number | undefined>(undefined);
  const [proteina, setProteina] = useState<number | undefined>(undefined);

  const agregarIngrediente = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoIngrediente.trim() && !ingredientes.includes(nuevoIngrediente.trim())) {
      setIngredientes([...ingredientes, nuevoIngrediente.trim()]);
      setNuevoIngrediente('');
    }
  };

  const eliminarIngrediente = (ingrediente: string) => {
    setIngredientes(ingredientes.filter(i => i !== ingrediente));
  };

  const agregarAlergia = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaAlergia.trim() && !alergias.includes(nuevaAlergia.trim())) {
      setAlergias([...alergias, nuevaAlergia.trim()]);
      setNuevaAlergia('');
    }
  };

  const eliminarAlergia = (alergia: string) => {
    setAlergias(alergias.filter(a => a !== alergia));
  };

  const toggleRestriccion = (restriccion: string) => {
    if (restricciones.includes(restriccion)) {
      setRestricciones(restricciones.filter(r => r !== restriccion));
    } else {
      setRestricciones([...restricciones, restriccion]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (ingredientes.length === 0) {
      alert('Por favor agrega al menos un ingrediente');
      return;
    }

    onGenerate({
      ingredientes,
      categoria,
      objetivos: {
        objetivo,
        restricciones_dieteticas: restricciones.length > 0 ? restricciones : undefined,
        alergias: alergias.length > 0 ? alergias : undefined,
        calorias_objetivo: calorias,
        proteina_objetivo: proteina,
      },
      porciones,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Ingredientes */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-emerald-400" />
          Ingredientes Disponibles
        </h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevoIngrediente}
            onChange={(e) => setNuevoIngrediente(e.target.value)}
            placeholder="Ej: Pollo, Arroz integral, Aguacate..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            disabled={isGenerating}
          />
          <button
            type="button"
            onClick={agregarIngrediente}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isGenerating}
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ingredientes.map((ing) => (
            <div
              key={ing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-white border border-slate-700"
            >
              <span className="text-sm">{ing}</span>
              <button
                type="button"
                onClick={() => eliminarIngrediente(ing)}
                className="text-slate-400 hover:text-red-400 transition-colors"
                disabled={isGenerating}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {ingredientes.length === 0 && (
            <p className="text-slate-500 text-sm">No has agregado ingredientes aún</p>
          )}
        </div>
      </div>

      {/* Categoría y Porciones */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Tipo de Comida
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as RecipeCategory)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            disabled={isGenerating}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Porciones
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={porciones}
            onChange={(e) => setPorciones(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Objetivo Fitness */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Objetivo Fitness</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {OBJETIVOS.map((obj) => {
            const Icon = obj.icon;
            const isSelected = objetivo === obj.value;
            return (
              <button
                key={obj.value}
                type="button"
                onClick={() => setObjetivo(obj.value as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
                disabled={isGenerating}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                <span className="text-sm font-medium">{obj.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Restricciones Dietéticas */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Restricciones Dietéticas (Opcional)</h3>
        <div className="flex flex-wrap gap-2">
          {RESTRICCIONES_DIETETICAS.map((rest) => (
            <button
              key={rest}
              type="button"
              onClick={() => toggleRestriccion(rest)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                restricciones.includes(rest)
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
              disabled={isGenerating}
            >
              {rest}
            </button>
          ))}
        </div>
      </div>

      {/* Alergias */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Alergias (Opcional)</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevaAlergia}
            onChange={(e) => setNuevaAlergia(e.target.value)}
            placeholder="Ej: Nueces, Soja, Mariscos..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            disabled={isGenerating}
          />
          <button
            type="button"
            onClick={agregarAlergia}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
            disabled={isGenerating}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {alergias.map((alergia) => (
            <div
              key={alergia}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 rounded-lg text-red-300 border border-red-800"
            >
              <span className="text-sm">{alergia}</span>
              <button
                type="button"
                onClick={() => eliminarAlergia(alergia)}
                className="text-red-400 hover:text-red-300 transition-colors"
                disabled={isGenerating}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos Nutricionales */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Objetivos Nutricionales (Opcional)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Calorías por Porción
            </label>
            <input
              type="number"
              min="0"
              value={calorias || ''}
              onChange={(e) => setCalorias(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ej: 500"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Proteína por Porción (g)
            </label>
            <input
              type="number"
              min="0"
              value={proteina || ''}
              onChange={(e) => setProteina(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ej: 30"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              disabled={isGenerating}
            />
          </div>
        </div>
      </div>

      {/* Botón de Generar */}
      <button
        type="submit"
        disabled={isGenerating || ingredientes.length === 0}
        className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando tu receta fitness...
          </>
        ) : (
          <>
            <ChefHat className="w-5 h-5" />
            Generar Receta Fitness
          </>
        )}
      </button>
    </form>
  );
}
