import React from 'react';
import { X, Target, Clock, BookOpen, AlertCircle, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // Asumiendo que tienes un componente Button

interface GoalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente pequeño para las secciones internas
const GuideSection: React.FC<{ icon: React.ElementType, title: string, color: string, children: React.ReactNode }> = ({ icon: Icon, title, color, children }) => (
  <div className="p-4 md:p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
    <h3 className={`text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
      <Icon className="w-6 h-6 shrink-0" />
      {title}
    </h3>
    {children}
  </div>
);

// Componente de Párrafo
const GuideParagraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
);

export const GoalGuideModal: React.FC<GoalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Overlay Oscuro (Efecto Modal)
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Contenido del Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-y-auto transform transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Botón de Cierre */}
        <Button 
          onClick={onClose} 
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-700/50 sticky top-0 bg-slate-900/90 backdrop-blur-md rounded-t-2xl">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-emerald-400" />
            Guía: Elige tu Objetivo Ideal
          </h2>
          <p className="text-slate-500 mt-1">Información basada en la ciencia nutricional y deportiva.</p>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 space-y-10">
          
          {/* SECCIÓN 1: Tipos de Objetivo */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Target className="w-5 h-5" />
              Tipos de Objetivo y Recomendaciones
            </h3>
            
            <GuideSection icon={TrendingDown} title="Perder Grasa (Corte/Déficit)" color="to-red-500 from-orange-500">
              <GuideParagraph>
                Implica consumir menos calorías de las que se queman (déficit calórico) para que el cuerpo utilice la grasa almacenada como fuente de energía. Este es el camino más rápido para la definición corporal.
              </GuideParagraph>
              <GuideParagraph>
                **Recomendación científica:** Un déficit moderado del 15% al 25% de tu Gasto Energético Diario Total (TDEE) es ideal. Un déficit mayor puede acelerar la pérdida de peso, pero aumenta significativamente el riesgo de pérdida de masa muscular y fatiga.
              </GuideParagraph>
              <div className="flex items-start gap-2 text-xs p-3 rounded-lg bg-red-500/10 text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                **Importante:** Asegurar una ingesta alta de proteínas (1.6g a 2.2g por kg de peso corporal) es crucial para preservar el músculo durante el déficit.
              </div>
            </GuideSection>

            <GuideSection icon={TrendingUp} title="Ganar Músculo (Volumen/Superávit)" color="to-cyan-500 from-blue-500">
              <GuideParagraph>
                Requiere consumir más calorías de las que se queman (superávit calórico) para proporcionar la energía necesaria para la síntesis de nuevas proteínas musculares, junto con entrenamiento de resistencia adecuado.
              </GuideParagraph>
              <GuideParagraph>
                **Recomendación científica:** Un superávit pequeño y controlado (entre 250 y 500 calorías por encima del TDEE) es óptimo para maximizar la ganancia de músculo y minimizar la acumulación de grasa corporal innecesaria.
              </GuideParagraph>
              <GuideParagraph>
                Un superávit demasiado grande solo resultará en una mayor ganancia de grasa. La tasa de crecimiento muscular tiene un límite natural.
              </GuideParagraph>
            </GuideSection>

            <GuideSection icon={Zap} title="Recomposición Corporal" color="to-pink-500 from-purple-500">
              <GuideParagraph>
                El arte de perder grasa y ganar músculo simultáneamente. Esto es más viable en principiantes, personas con sobrepeso significativo, o aquellos que regresan al entrenamiento después de un largo descanso.
              </GuideParagraph>
              <GuideParagraph>
                **Recomendación:** Se maneja con un consumo calórico cercano al mantenimiento (TDEE), o incluso con ciclos de días de ligero superávit seguidos de días de ligero déficit. Requiere una alta ingesta de proteínas y un entrenamiento de fuerza intenso y constante.
              </GuideParagraph>
            </GuideSection>
          </div>
          
          {/* SECCIÓN 2: Velocidad de Progreso */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-5 h-5" />
              Impacto de la Velocidad de Progreso
            </h3>
            
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="p-3 text-slate-300">Velocidad</th>
                  <th className="p-3 text-slate-300 hidden sm:table-cell">Descripción</th>
                  <th className="p-3 text-slate-300">Tasa de Progreso (LOSE)</th>
                  <th className="p-3 text-slate-300">Tasa de Progreso (GAIN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="bg-slate-900/50 hover:bg-slate-800/70 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">Lento (Slow)</td>
                  <td className="p-3 text-slate-400 hidden sm:table-cell">Máxima sostenibilidad y retención muscular.</td>
                  <td className="p-3 text-orange-400">0.25 - 0.5 kg/semana</td>
                  <td className="p-3 text-cyan-400">0.1 - 0.25 kg/semana (mínima grasa)</td>
                </tr>
                <tr className="bg-slate-900/50 hover:bg-slate-800/70 transition-colors border-l-4 border-emerald-500">
                  <td className="p-3 font-semibold text-white">Moderado (Recommended)</td>
                  <td className="p-3 text-slate-400 hidden sm:table-cell">Balance óptimo entre velocidad y efectos secundarios.</td>
                  <td className="p-3 text-emerald-400">0.5 - 1.0 kg/semana</td>
                  <td className="p-3 text-emerald-400">0.25 - 0.5 kg/semana (óptimo)</td>
                </tr>
                <tr className="bg-slate-900/50 hover:bg-slate-800/70 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">Agresivo (Aggressive)</td>
                  <td className="p-3 text-slate-400 hidden sm:table-cell">Para plazos cortos, alta dificultad y riesgo.</td>
                  <td className="p-3 text-red-400">Más de 1.0 kg/semana</td>
                  <td className="p-3 text-red-400">Más de 0.5 kg/semana (alta ganancia de grasa)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 3: Fuentes Bibliográficas */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xl font-bold text-slate-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Fuentes Bibliográficas (Evidencia Científica)
            </h3>
            <ol className="list-decimal list-inside text-xs text-slate-500 space-y-1 pl-2">
              <li>
                Schoenfeld, B. J., & Aragon, A. A. (2018). How much protein can the body use in a single meal for muscle building? Implications for daily protein distribution. *Journal of the International Society of Sports Nutrition*, 15(1). (Déficit y Ganancia Muscular)
              </li>
              <li>
                Helms, E. R., Aragon, A. A., & Fitschen, P. J. (2014). Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. *Journal of the International Society of Sports Nutrition*, 11(1), 20. (Tasas de pérdida de peso en déficit)
              </li>
              <li>
                Garthe, I., Raastad, T., Refsnes, P. E., Koivisto, A., & Sundgot-Borgen, J. (2013). Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes. *International Journal of Sport Nutrition and Exercise Metabolism*, 23(1), 19-29. (Efectos de la velocidad en la composición corporal)
              </li>
            </ol>
          </div>

        </div>

        {/* Footer del Modal */}
        <div className="p-6 md:p-8 border-t border-slate-700/50 flex justify-end">
            <Button 
                onClick={onClose} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
                Entendido
            </Button>
        </div>

      </div>
    </div>
  );
};