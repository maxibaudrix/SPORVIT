import { Camera } from 'lucide-react';

// src/components/scanner/CameraPlaceholder.tsx
// Componente simple para simular el área de la cámara antes de integrar html5-qrcode.

export function CameraPlaceholder() {
  return (
    <div 
      className="relative flex items-center justify-center w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-inner border-4 border-gray-300 dark:border-gray-600"
      aria-label="Área de visualización de la cámara para escanear código de barras"
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-center text-white p-4 rounded-lg bg-black/20">
          <Camera className="w-12 h-12 mx-auto mb-2 text-white/80" />
          <p className="text-sm font-semibold">
            Área de Cámara / Scanner
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Requiere inicialización de librerías como `html5-qrcode`)
          </p>
        </div>
      </div>
      {/* Marco de escaneo simulado */}
      <div className="absolute inset-4 border-dashed border-4 border-green-400 rounded-lg opacity-80 pointer-events-none"></div>
    </div>
  );
}