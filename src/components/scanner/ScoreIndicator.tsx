// src/components/scanner/ScoreIndicator.tsx
import React from "react";

export default function ScoreIndicator({ score }: { score: number | null }) {
  // score expected 0..100 (higher = healthier)
  if (score === null) {
    return <div className="px-2 py-1 rounded text-sm bg-gray-200">Sin score</div>;
  }
  const color =
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-400" : "bg-rose-500";
  const label = score >= 75 ? "Bueno" : score >= 50 ? "Aceptable" : "Evitar";

  return (
    <div className={`inline-flex items-center gap-2 p-1 rounded`}>
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div className="text-sm font-medium">{label} · {Math.round(score)}%</div>
    </div>
  );
}
