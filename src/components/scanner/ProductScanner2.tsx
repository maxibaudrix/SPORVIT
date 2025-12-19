// src/components/scanner/ProductScanner.tsx
import React, { useState } from 'react';
import { Scan, Loader2, X, Search } from 'lucide-react';

// Importación de tus componentes modulares
import CameraScanner from './CameraScanner';
import ProductCard from './ProductCard';
import { CameraPlaceholder } from './CameraPlaceholder'; // Asegúrate de que exportas 'CameraPlaceholder' en su archivo
// Si ScoreIndicator se usa dentro de ProductCard, no hace falta importarlo aquí.

// --- TIPOS ---
// Esta interfaz debe coincidir con lo que espera ProductCard
interface ProductData {
    name: string;
    code: string;
    nutriscoreGrade: 'A' | 'B' | 'C' | 'D' | 'E';
    novaGroup: 1 | 2 | 3 | 4;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    brand: string;
    imageUrl?: string; // Opcional, para mejorar la UI
}

// --- COMPONENTES UI SIMPLES (Botones/Inputs) ---
// Puedes mover estos a una carpeta /ui compartida más adelante
const Button: React.FC<{ children: React.ReactNode; onClick: () => void; disabled?: boolean; className?: string; }> = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 font-semibold transition-colors duration-200 rounded-lg shadow-md ${
      disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
    } ${className}`}
  >
    {children}
  </button>
);

const Input: React.FC<{ placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onKeyDown?: (e: React.KeyboardEvent) => void; disabled?: boolean; 
}> = ({ placeholder, value, onChange, onKeyDown, disabled = false }) => (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600"
    />
);

export default function ProductScanner() {
    const [barcode, setBarcode] = useState('');
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [sporvitScore, setSporvitScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // --- LÓGICA DE API REAL ---
    
    // 1. Normalizador: Convierte la respuesta de OpenFoodFacts a tu ProductData
    const processProductData = (data: any): ProductData => {
        return {
            name: data.product_name || "Producto desconocido",
            code: data.code,
            nutriscoreGrade: (data.nutriscore_grade?.toUpperCase() as any) || 'E',
            novaGroup: data.nova_group || 4,
            calories: Math.round(data.nutriments?.['energy-kcal_100g'] || 0),
            protein: data.nutriments?.proteins_100g || 0,
            carbs: data.nutriments?.carbohydrates_100g || 0,
            fat: data.nutriments?.fat_100g || 0,
            servingSize: 100, // OFF a veces no da serving size exacto, estandarizamos a 100g o extraemos serving_quantity
            brand: data.brands || "Marca no especificada",
            imageUrl: data.image_url
        };
    };

    // 2. Orquestador de Fetch
    const searchProduct = async (code: string) => {
        if (!code || code.length < 3) {
            setError("Por favor ingresa un código válido.");
            return;
        }

        setLoading(true);
        setError(null);
        setProductData(null);
        setSporvitScore(null);
        setIsCameraActive(false); // Detener cámara al empezar a buscar

        try {
            // --- CAMBIO: Llamada a TU API (Next.js API Route) ---
            const response = await fetch('/api/scanner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    barcode: code,
                    // Aquí podrías inyectar preferencias reales del usuario si las tuvieras
                    prefs: { goal: 'muscle' } 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejar errores que vienen de tu API (ej. 404 product_not_found)
                throw new Error(data.error || "Error al obtener el producto");
            }

            // data.product es el objeto raw de OpenFoodFacts
            // data.score es el número calculado por tu backend
            
            const processedProduct = processProductData(data.product);
            
            setProductData(processedProduct);
            setSporvitScore(data.score); // Usamos el score real del backend

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---

    const handleCameraDetected = (code: string) => {
        // Reproducir sonido beep (opcional)
        const audio = new Audio('https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_MP3.mp3'); // Reemplazar con beep corto base64
        audio.volume = 0.2;
        audio.play().catch(() => {});
        
        setBarcode(code);
        searchProduct(code);
    };

    const handleManualSubmit = () => {
        searchProduct(barcode);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleManualSubmit();
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sporvit Scanner</h1>
                <p className="text-gray-500 dark:text-gray-400">Analiza tus alimentos al instante</p>
            </header>

            {/* SECCIÓN 1: Área de Escaneo / Cámara */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                {!productData && (
                    isCameraActive ? (
                        <CameraScanner 
                            onDetected={handleCameraDetected} 
                            onStop={() => setIsCameraActive(false)} 
                        />
                    ) : (
                        <div className="p-4">
                            <CameraPlaceholder /> 
                            <div className="mt-4 flex justify-center">
                                <Button onClick={() => setIsCameraActive(true)} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
                                    <Scan className="w-5 h-5 mr-2" />
                                    Activar Cámara
                                </Button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* SECCIÓN 2: Input Manual (Solo visible si no hay producto o estamos buscando otro) */}
            {!productData && (
                <div className="flex gap-2 items-center bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                        <Input 
                            placeholder="Escribe el código de barras..." 
                            value={barcode} 
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                    </div>
                    <Button onClick={handleManualSubmit} disabled={loading || !barcode} className="aspect-square p-0 w-12 h-10">
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </Button>
                </div>
            )}

            {/* SECCIÓN 3: Estados de Carga y Error */}
            {loading && !productData && (
                <div className="flex flex-col items-center justify-center py-8 text-blue-600 animate-pulse">
                    <Loader2 className="w-10 h-10 animate-spin mb-2" />
                    <p className="font-medium">Consultando bases de datos...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                    <X className="w-6 h-6 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* SECCIÓN 4: Resultado del Producto */}
            {productData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProductCard 
                        product={productData} 
                        score={sporvitScore} 
                        onOpen={() => console.log("Detalles expandidos")} // Opcional
                        onClose={() => {
                            setProductData(null);
                            setBarcode("");
                        }} 
                    />
                    
                    <button 
                        onClick={() => {
                            setProductData(null);
                            setBarcode("");
                            setIsCameraActive(true); // Reiniciar cámara inmediatamente si se desea
                        }}
                        className="mt-4 w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Escanear otro producto
                    </button>
                </div>
            )}
        </div>
    );
}