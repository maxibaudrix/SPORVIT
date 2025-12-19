'use client';
import React, { useState } from 'react';
import { 
  Clock, Flame, Users, ChevronLeft, Heart, Share2, 
  ChefHat, CheckCircle2, ShoppingCart, Plus, 
  Minus, PlayCircle
} from 'lucide-react';
import { number } from 'zod';

export default function RecipePreview() {
  const [servings, setServings] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const recipe = {
    title: "Bowl de Salmón y Quinoa",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000",
    macros: { calories: 520, protein: 35, carbs: 45, fats: 22 },
    ingredients: [
      { id: 1, name: "Filete de salmón fresco", baseQty: 150, unit: "g" },
      { id: 2, name: "Quinoa cocida", baseQty: 120, unit: "g" },
      { id: 3, name: "Aguacate maduro", baseQty: 0.5, unit: "unidad" },
      { id: 4, name: "Espinacas frescas", baseQty: 50, unit: "g" },
    ],
    steps: [
      { id: 1, text: "Sazona el salmón con sal, pimienta y limón." },
      { id: 2, text: "Cocina el salmón 4 min por lado." },
      { id: 3, text: "Monta el bowl con la base de quinoa y espinacas." },
    ]
  };

  const toggleIngredient = (id: number) => setCheckedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleStep = (id: number) => setCompletedSteps(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const adjustServings = (d: number) => setServings(prev => Math.max(1, prev + d));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      {/* HERO */}
      <div className="relative h-64 w-full">
        <img src={recipe.image} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        <div className="absolute bottom-0 p-6 w-full">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-400"/> 25 min</span>
            <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400"/> Fácil</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-5xl grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* MACROS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-center">
             <div><div className="text-2xl font-bold">{recipe.macros.calories}</div><div className="text-xs text-slate-400">Kcal</div></div>
             <div className="h-8 w-px bg-slate-700"></div>
             <div><div className="text-lg font-bold text-blue-400">{recipe.macros.protein}g</div><div className="text-xs text-slate-400">Prot</div></div>
             <div><div className="text-lg font-bold text-orange-400">{recipe.macros.carbs}g</div><div className="text-xs text-slate-400">Carb</div></div>
             <div><div className="text-lg font-bold text-yellow-400">{recipe.macros.fats}g</div><div className="text-xs text-slate-400">Grasa</div></div>
          </div>

          {/* INGREDIENTS */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Ingredientes</h3>
              <div className="flex items-center bg-slate-800 rounded p-1">
                <button onClick={() => adjustServings(-1)} className="p-1 text-slate-400 hover:text-white"><Minus className="w-4 h-4"/></button>
                <span className="w-6 text-center font-bold text-sm">{servings}</span>
                <button onClick={() => adjustServings(1)} className="p-1 text-slate-400 hover:text-white"><Plus className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
              {recipe.ingredients.map(ing => (
                <div key={ing.id} onClick={() => toggleIngredient(ing.id)} className="flex items-center p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${checkedIngredients.includes(ing.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                    {checkedIngredients.includes(ing.id) && <CheckCircle2 className="w-3 h-3 text-black"/>}
                  </div>
                  <span className={`flex-1 ${checkedIngredients.includes(ing.id) ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{ing.name}</span>
                  <span className="text-sm font-mono text-emerald-400">{ing.baseQty * servings} {ing.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <h3 className="text-lg font-bold mb-3">Pasos</h3>
          <div className="space-y-4">
            {recipe.steps.map((step, i) => (
              <div key={step.id} className="flex gap-3">
                <button onClick={() => toggleStep(step.id)} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${completedSteps.includes(step.id) ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {completedSteps.includes(step.id) ? <CheckCircle2 className="w-4 h-4"/> : i + 1}
                </button>
                <p className={`text-sm ${completedSteps.includes(step.id) ? 'text-slate-500' : 'text-slate-300'}`}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <div className="fixed bottom-0 w-full bg-slate-950/90 border-t border-slate-800 p-4 z-40 flex justify-between items-center gap-4">
        <div className="hidden sm:block">
            <p className="text-xs text-slate-400">Total</p>
            <p className="font-bold">{recipe.macros.calories * servings} kcal</p>
        </div>
        <button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg transition-colors">Añadir al Diario</button>
      </div>
    </div>
  );
}