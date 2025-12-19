import React, { useState, useCallback } from 'react';
import { Camera, X, AlertCircle, Loader2, Package, Scan, Zap } from 'lucide-react';

// ====================================================================
// 1. TIPOS Y MOCK DATA (TypeScript)
// ====================================================================

/**
 * Definición de la estructura de datos para un producto.
 */
interface ProductData {
  name: string;
  code: string;
  nutriscoreGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  novaGroup: 1 | 2 | 3 | 4;
  calories: number; // por 100g
  proteins: number; // por 100g
  carbs: number; // por 100g
  fat: number; // por 100g
  brand: string;
  sporvitScore: 'GREEN' | 'YELLOW' | 'RED'; // Score personalizado (Simulado)
  scoreReason: string;
  imageUrl: string;
}

// Mock de productos para simular una base de datos/API
const MOCK_PRODUCTS: { [code: string]: ProductData } = {
  '3017620422003': {
    name: 'Nutella',
    code: '3017620422003',
    brand: 'Ferrero',
    nutriscoreGrade: 'E',
    novaGroup: 4,
    calories: 539, proteins: 6.3, carbs: 57.5, fat: 30.9,
    sporvitScore: 'RED',
    scoreReason: 'Ultra-procesado y alto en azúcar. No recomendado para pérdida de grasa.',
    imageUrl: 'https://placehold.co/200x200/ef4444/ffffff?text=Nutella'
  },
  '8410076472069': {
    name: 'Avena Integral',
    code: '8410076472069',
    brand: 'Hacendado',
    nutriscoreGrade: 'A',
    novaGroup: 1,
    calories: 371, proteins: 13, carbs: 59, fat: 7,
    sporvitScore: 'GREEN',
    scoreReason: '¡Excelente! Alto en fibra y proteína. Perfecto para tu objetivo.',
    imageUrl: 'https://placehold.co/200x200/10b981/ffffff?text=Avena'
  },
  '5449000000996': {
    name: 'Coca-Cola Zero Azúcar',
    code: '5449000000996',
    brand: 'Coca-Cola',
    nutriscoreGrade: 'B',
    novaGroup: 4,
    calories: 0, proteins: 0, carbs: 0, fat: 0,
    sporvitScore: 'YELLOW',
    scoreReason: 'Sin calorías, pero ultra-procesado con edulcorantes. Consumir con moderación.',
    imageUrl: 'https://placehold.co/200x200/f59e0b/ffffff?text=Cola'
  }
};

// ====================================================================
// 2. COMPONENTES AUXILIARES
// ====================================================================

interface ProductCardProps {
    product: ProductData;
    onClose: () => void;
}

/**
 * Componente que simula la tarjeta de un producto.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClose }) => {
  // Función para determinar el color de Nutri-Score
  const getNutriscoreStyle = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-white bg-green-600';
      case 'B': return 'text-white bg-lime-500';
      case 'C': return 'text-gray-900 bg-yellow-400';
      case 'D': return 'text-white bg-orange-500';
      case 'E': return 'text-white bg-red-600';
      default: return 'text-gray-600 bg-gray-200';
    }
  };

  // Función para determinar el color de NOVA Group
  const getNovaGroupStyle = (group: number) => {
    switch (group) {
      case 1: return 'text-green-500 border-green-500';
      case 2: return 'text-lime-500 border-lime-500';
      case 3: return 'text-yellow-500 border-yellow-500';
      case 4: return 'text-red-500 border-red-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  // Función para determinar el estilo del Score Personalizado
  const getSporvitScoreStyle = (score: string) => {
    switch (score) {
      case 'GREEN': return 'bg-emerald-600';
      case 'YELLOW': return 'bg-yellow-500';
      case 'RED': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const nutriscoreColor = getNutriscoreStyle(product.nutriscoreGrade);
  const novaGroupColor = getNovaGroupStyle(product.novaGroup);
  const sporvitScoreColor = getSporvitScoreStyle(product.sporvitScore);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
      <div className={`p-4 ${sporvitScoreColor} text-white flex items-center justify-between`}>
          <h2 className="text-xl font-bold uppercase">
              {product.sporvitScore === 'GREEN' ? 'Recomendado' : product.sporvitScore === 'YELLOW' ? 'Moderado' : 'Evitar'}
          </h2>
          <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-white/20 transition-colors" 
              aria-label="Cerrar tarjeta de producto"
          >
              <X className="w-5 h-5" />
          </button>
      </div>

      <div className="p-6 md:flex gap-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
              <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-24 h-24 object-contain rounded-lg border dark:border-gray-600 bg-white" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100/374151/ffffff?text=Producto'; }}
              />
          </div>
          <div className="flex-grow">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Marca: {product.brand} | Código: {product.code}
              </p>
              
              <div className="flex flex-wrap gap-3 items-center mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className={`px-3 py-1 rounded-lg text-sm font-extrabold shadow-md ${nutriscoreColor}`}>
                      Nutri-Score: {product.nutriscoreGrade}
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm font-bold border-2 ${novaGroupColor}`}>
                      NOVA Group: {product.novaGroup}
                  </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Tu Evaluación Sporvit:</p>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">{product.scoreReason}</p>
              </div>

              <h5 className="font-semibold text-base mt-4 mb-2 text-gray-900 dark:text-white border-b pb-1">Nutrición (por 100g)</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><strong>Calorías:</strong> {product.calories} kcal</p>
                  <p><strong>Proteínas:</strong> {product.proteins} g</p>
                  <p><strong>Carbohidratos:</strong> {product.carbs} g</p>
                  <p><strong>Grasas:</strong> {product.fat} g</p>
              </div>
          </div>
      </div>
    </div>
  );
};

interface CameraPlaceholderProps {
    onScan: (code: string) => void;
    onStop: () => void;
}

/**
 * Componente que simula el área de la cámara/escáner.
 */
const CameraPlaceholder: React.FC<CameraPlaceholderProps> = ({ onScan, onStop }) => {
    const [barcode, setBarcode] = useState('');

    const handleScan = () => {
        if (barcode.trim()) {
            onScan(barcode.trim());
        }
    };

    return (
        <div className="relative w-full md:w-96 mx-auto h-72 bg-slate-900 rounded-xl shadow-inner border-2 border-slate-700 overflow-hidden">
            
            {/* Overlay principal - Simulación de la cámara */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <div className="text-center text-white p-4">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-white/80" />
                    <p className="text-sm font-semibold">
                        Cámara/Scanner (Simulado)
                    </p>
                </div>
            </div>

            {/* Marco de escaneo simulado y línea animada */}
            <div className="absolute inset-4 border-dashed border-4 border-emerald-500 rounded-lg opacity-80 pointer-events-none">
                <div className="absolute w-full h-1 bg-red-400 scan-line rounded-full" />
            </div>

            {/* Controles de Simulación (para la demo) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800/90 backdrop-blur-sm pointer-events-auto">
                <p className='text-xs text-slate-400 mb-2'>Simular Escaneo (Códigos disponibles: {Object.keys(MOCK_PRODUCTS).join(', ')})</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Introduce código de barras"
                        className="flex-grow p-2 text-sm rounded-lg bg-slate-700 text-white border border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                        onClick={handleScan}
                        className="flex items-center justify-center p-2 text-sm font-semibold transition-colors duration-200 rounded-lg shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={!barcode}
                    >
                        <Scan className="w-4 h-4 mr-1" /> OK
                    </button>
                    <button
                        onClick={onStop}
                        className="flex items-center justify-center p-2 text-sm font-semibold transition-colors duration-200 rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white"
                        aria-label="Detener cámara"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Estilos para la animación de la línea de escaneo */}
            <style jsx>{`
                @keyframes scan {
                    0% { top: 10%; }
                    50% { top: 90%; }
                    100% { top: 10%; }
                }
                .scan-line {
                    animation: scan 3s infinite linear;
                }
            `}</style>
        </div>
    );
};

// ====================================================================
// 3. COMPONENTE PRINCIPAL (ProductScanner)
// ====================================================================

const ProductScanner: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Función simulada de API para buscar el producto
  const fetchProduct = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    setProductData(null);
    
    // Simular un tiempo de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    const product = MOCK_PRODUCTS[code];
    
    if (product) {
      setProductData(product);
      setError(null);
    } else {
      setError(`Código no encontrado: ${code}. Intenta con ${Object.keys(MOCK_PRODUCTS).join(', ')}.`);
    }
    setLoading(false);
  }, []);

  // Manejador cuando el escáner detecta un código
  const handleDetectedCode = useCallback((code: string) => {
    setScannedCode(code);
    setIsCameraActive(false); // Detener cámara al escanear
    fetchProduct(code);
  }, [fetchProduct]);

  // Manejador para iniciar el proceso de escaneo
  const startScan = () => {
    setProductData(null);
    setError(null);
    setScannedCode(null);
    setIsCameraActive(true);
  };

  // Manejador para detener el escaneo
  const stopScan = () => {
    setIsCameraActive(false);
    setLoading(false);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-emerald-400 flex items-center justify-center gap-3">
          <Scan className="w-8 h-8" />
          Sporvit Scanner
        </h1>
        <p className="text-slate-400 mt-2">Escanea tu alimentación para un fitness inteligente.</p>
      </header>

      {/* ========================================================== */}
      {/* ÁREA DE ESCÁNER/RESULTADO */}
      {/* ========================================================== */}

      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
          {!isCameraActive && !productData && !loading && (
              <div className="text-center p-6 border-2 border-dashed border-slate-700 rounded-xl">
                  <p className="text-slate-400 mb-4">
                      Listo para escanear. Presiona el botón para iniciar la cámara.
                  </p>
                  <button
                      onClick={startScan}
                      className="inline-flex items-center px-6 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                      <Camera className="w-6 h-6 mr-2" />
                      Iniciar Escáner
                  </button>
              </div>
          )}
          
          {/* Vista del Escáner Activo (Simulado) */}
          {isCameraActive && (
              <CameraPlaceholder 
                  onScan={handleDetectedCode} 
                  onStop={stopScan} 
              />
          )}

          {/* Indicadores de Estado y Carga */}
          {!isCameraActive && (
              <div className="mt-4 text-center min-h-[40px]">
                  {loading && (
                      <p className="text-emerald-400 flex items-center justify-center font-medium">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Buscando información de {scannedCode}...
                      </p>
                  )}
                  {error && (
                      <div className="p-3 bg-red-900/50 text-red-300 rounded-lg flex items-center justify-center mx-auto max-w-sm border border-red-800">
                          <AlertCircle className="mr-2 h-5 w-5" />
                          <p>{error}</p>
                      </div>
                  )}
              </div>
          )}
      </div>

      {/* ========================================================== */}
      {/* RESULTADOS DEL PRODUCTO */}
      {/* ========================================================== */}

      {productData && (
        <ProductCard 
          product={productData} 
          onClose={() => { setProductData(null); setScannedCode(null); }} 
        />
      )}
      
      {/* ========================================================== */}
      {/* INFORMACIÓN ADICIONAL */}
      {/* ========================================================== */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Guía de Puntuación
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><strong className="text-emerald-400">Verde:</strong> Excelente para tu objetivo de fitness</li>
            <li><strong className="text-yellow-400">Amarillo:</strong> Aceptable con moderación</li>
            <li><strong className="text-red-400">Rojo:</strong> Evitar o consumir muy raramente</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Contexto de Escaneo
          </h3>
          <p className="text-sm text-slate-400">
            El escáner simula la búsqueda de Nutri-Score (calificación oficial) y una puntuación personalizada (Sporvit Score), adaptada a objetivos de fitness (corte o volumen) y preferencias dietéticas.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ProductScanner;