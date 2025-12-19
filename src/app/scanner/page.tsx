"use client"; 

import React from "react";
// Importa el componente orquestador que ahora contiene TODA la lógica y UI.
import ProductScanner from "@/components/scanner/ProductScanner"; 

/**
 * Componente de la Ruta /scanner
 * Su única función es renderizar el componente principal ProductScanner.
 */
export default function ScannerRoutePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <ProductScanner />
    </main>
  );
}