import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Scan, X, Loader2, AlertTriangle } from 'lucide-react';

// Interfaces y Placeholder de Button (para ser auto-contenido)
interface CameraScannerProps {
  onDetected: (code: string) => void;
  onStop: () => void;
}

const Button: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center px-3 py-1 font-semibold transition-colors duration-200 rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
        {children}
    </button>
);

const CameraScanner: React.FC<CameraScannerProps> = ({ onDetected, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastDetectedRef = useRef<string | null>(null);
  const codeReaderRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para detener y limpiar el escáner
  const stopScan = useCallback(() => {
    if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
    }
    onStop(); 
  }, [onStop]);


  // Lógica de escaneo continuo
  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // 1. Importación dinámica de ZXing
      const ZXing = await import("@zxing/library");
      
      // 2. Inicializar el lector
      if (!codeReaderRef.current) {
        codeReaderRef.current = new ZXing.BrowserMultiFormatReader();
      }
      const codeReader = codeReaderRef.current;

      // 3. Iniciar el escaneo usando la cámara predeterminada (null)
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result: any, scanError: any) => {
        
        if (scanError) {
          if (scanError.name !== "NotFoundException") {
             // console.error("ZXing Error:", scanError); 
          }
          return;
        }

        if (result) {
          const decodedText = (result as any)?.getText ? (result as any).getText() : (result as any).text;

          if (decodedText && lastDetectedRef.current !== decodedText) {
            lastDetectedRef.current = decodedText;
            onDetected(decodedText);
            stopScan();
          }
        }
      });
      
      // 4. Desactivar la carga cuando se inicie la reproducción del video
      // Esto es más fiable que onloadedmetadata para saber cuándo el usuario ve algo.
      if (videoRef.current) {
        // Limpiamos el error anterior que teníamos
        videoRef.current.onloadedmetadata = null; 
        
        videoRef.current.oncanplay = () => {
            setIsLoading(false);
        };
      }

    } catch (err: any) {
      setIsLoading(false);
      console.error("Error al inicializar el scanner:", err);
      
      let errorMessage = "Error desconocido al iniciar la cámara.";
      if (err.name === "NotAllowedError" || err.message.includes("Permission denied")) {
        errorMessage = "Acceso denegado. Por favor, asegúrate de dar permisos de cámara al navegador.";
      } else if (err.name === "NotFoundError" || err.message.includes("No video input devices")) {
        errorMessage = "No se encontraron dispositivos de cámara. Verifica que la cámara esté conectada.";
      } else if (err.name === "NotReadableError") {
          errorMessage = "La cámara está en uso por otra aplicación. Ciérrala y vuelve a intentarlo.";
      }

      setError(errorMessage);
    }
  }, [onDetected, stopScan]);

  useEffect(() => {
    startScan();
    
    return () => stopScan();
  }, [startScan, stopScan]);


  return (
    <div className="relative rounded-xl overflow-hidden bg-black min-h-[300px] shadow-2xl">
      {/* Video Stream - AÑADIDO 'autoPlay' para forzar el inicio de la reproducción */}
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover transform scale-x-[-1]" 
        playsInline 
        muted 
        autoPlay={true}
      />
      
      {/* Overlay de Carga */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Esperando permiso de cámara...</p>
        </div>
      )}

      {/* Overlay con zona de escaneo y error */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Marcador de Escaneo */}
        {!isLoading && !error && (
            <div className="w-3/4 h-32 border-2 border-dashed border-green-500 rounded-lg backdrop-blur-sm bg-black/10 flex items-center justify-center transition-all duration-300 ease-in-out">
              <Scan className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
        )}
        
        {/* Mensaje de Error */}
        {error && (
            <div className="p-4 mt-4 bg-red-800/90 text-white text-center font-medium rounded-lg pointer-events-auto max-w-xs flex items-center flex-col">
              <AlertTriangle className='w-6 h-6 mb-2'/>
              {error}
            </div>
        )}
      </div>

      {/* Botón de Parar */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button onClick={stopScan} className="bg-red-500 hover:bg-red-600 p-3 rounded-full shadow-lg">
          <X className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};

export default CameraScanner;