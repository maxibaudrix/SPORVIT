'use client';

import { useState, useCallback, useMemo } from 'react';
import { MessageCircle, Send, Copy, Check, Mail } from 'lucide-react';

function parseISODuration(duration: string): string {
  if (!duration) return 'N/A';
  const match = duration.match(/PT(\d+)M/);
  if (match && match[1]) {
    const minutes = parseInt(match[1]);
    if (minutes === 0) return 'Sin cocción';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
  }
  return duration;
}

export default function ShareButtons({ recipe }: { recipe: any }) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/recipes/${recipe.slug}`
    : `https://sporvit.com/recipes/${recipe.slug}`;
  
  const shareText = useMemo(() => {
    return `🍳 ${recipe.name}\n\n⏱️ Tiempo: ${parseISODuration(recipe.totalTime)}\n👥 ${recipe.recipeYield} porciones\n\n✨ Descubre esta receta en Sporvit:`;
  }, [recipe]);
  
  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  }, []);
  
  return (
    <div className="grid grid-cols-4 gap-2">
      <button 
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`)}
        className="p-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg hover:text-green-500 hover:border-green-500 transition-all flex justify-center"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`)}
        className="p-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg hover:text-blue-400 hover:border-blue-400 transition-all flex justify-center"
      >
        <Send className="w-5 h-5" />
      </button>
      
      <button 
        onClick={() => copyToClipboard(shareText + " " + currentUrl)}
        className={`p-3 bg-slate-900/80 backdrop-blur border rounded-lg transition-all flex justify-center ${
          shareStatus === 'copied' 
            ? 'border-emerald-500 text-emerald-500' 
            : 'border-slate-700 text-slate-400 hover:border-slate-600'
        }`}
      >
        {shareStatus === 'copied' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      </button>
      
      <button 
        onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(recipe.name)}&body=${encodeURIComponent(shareText + " " + currentUrl)}`}
        className="p-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg hover:text-amber-400 hover:border-amber-400 transition-all flex justify-center"
      >
        <Mail className="w-5 h-5" />
      </button>
    </div>
  );
}