// src/components/progress/WeightChart.tsx
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useProgressStore } from '@/store/progress';

/**
 * Componente para mostrar la evolución del peso con objetivos y predicción.
 */

// Custom Tooltip para Recharts (funcionalidad de la librería)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800/90 text-white rounded-lg border border-slate-700 shadow-xl text-sm">
        <p className="font-bold">{label}</p>
        <p className="text-emerald-400">{`${payload[0].value} kg (Peso)`}</p>
        {payload[1] && <p className="text-orange-400">{`${payload[1].value.toFixed(2)} kg (Predicción)`}</p>}
      </div>
    );
  }
  return null;
};

// Función simple para generar un punto de predicción lineal (MOCKEO)
const calculateTrend = (data: any[], targetValue: number, weeks: number) => {
    if (data.length < 2) return [];

    const first = data[0].weight;
    const last = data[data.length - 1].weight;
    const dateDiff = new Date(data[data.length - 1].date).getTime() - new Date(data[0].date).getTime();
    const days = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
    
    // Asume que la tendencia continúa linealmente
    const ratePerDay = (last - first) / days;
    
    const predictionPoint = {
        date: new Date(new Date().getTime() + (weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        // Extrapola el último peso
        weight: last + (ratePerDay * (weeks * 7 * 24 * 60 * 60 * 1000) / (1000 * 60 * 60 * 24)),
    };
    
    return [
        { ...data[data.length - 1], prediction: data[data.length - 1].weight }, // Punto de inicio
        { ...predictionPoint, prediction: predictionPoint.weight } // Punto final
    ];
};


export const WeightChart: React.FC = () => {
  const { weightHistory, targetWeight, predictionWeeks } = useProgressStore();

  const trendData = calculateTrend(weightHistory, targetWeight, predictionWeeks);
  
  // Combinar data histórica y de predicción para el gráfico
  // Nota: Recharts necesita que los datos compartan la misma estructura de 'date'.
  const combinedData = weightHistory.map(d => ({
    ...d,
    target: targetWeight, // Añadir línea de objetivo
    prediction: undefined // Inicializar predicción
  }));
  
  // Añadir la línea de predicción como puntos separados en el array
  if (trendData.length === 2) {
      combinedData.push({ ...trendData[1], weight: undefined, target: targetWeight });
  }

  return (
    <div className="w-full h-80 bg-slate-900 rounded-xl p-4 shadow-inner border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tickFormatter={(value) => value.substring(5)} // Mostrar solo Mes-Día
            minTickGap={20}
          />
          
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']} 
            stroke="#94a3b8" 
            tickFormatter={(value) => `${value} kg`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Línea de Objetivo (Target Weight) */}
          <ReferenceLine y={targetWeight} stroke="#f97316" strokeDasharray="5 5" label={{ 
              value: "Objetivo", 
              position: "top", 
              fill: "#f97316", 
              fontSize: 12 
          }} />

          {/* Línea de Peso Real */}
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#06b6d4" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#06b6d4' }}
            activeDot={{ r: 8 }} 
            name="Peso Histórico"
          />
          
          {/* Línea de Predicción (usando el mismo dataKey, pero solo hay puntos en el futuro) */}
          {trendData.length === 2 && (
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#f97316" 
                strokeDasharray="5 5" 
                name="Predicción"
                dot={false}
              />
          )}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};