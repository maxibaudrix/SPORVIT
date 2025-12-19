// src/components/scanner/ProductCard.tsx
import React from 'react';

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
}

interface ProductCardProps {
    product: ProductData;
    score?: number | null; // <-- agregado
    onOpen?: () => void;
    onClose: () => void;    // <-- renombrado
}

// Placeholder para un componente Card simple con Tailwind
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, score, onOpen, onClose }) => {
    let nutriscoreColor = 'text-gray-600 bg-gray-200';
    if (product.nutriscoreGrade === 'A') nutriscoreColor = 'text-white bg-green-600';
    else if (product.nutriscoreGrade === 'B') nutriscoreColor = 'text-white bg-lime-500';
    else if (product.nutriscoreGrade === 'C') nutriscoreColor = 'text-white bg-yellow-500';
    else if (product.nutriscoreGrade === 'D') nutriscoreColor = 'text-white bg-orange-500';
    else if (product.nutriscoreGrade === 'E') nutriscoreColor = 'text-white bg-red-600';

    let novaGroupColor = 'text-gray-600';
    if (product.novaGroup === 1) novaGroupColor = 'text-green-500 border-green-500';
    else if (product.novaGroup === 4) novaGroupColor = 'text-red-500 border-red-500';
    else if (product.novaGroup === 3) novaGroupColor = 'text-orange-500 border-orange-500';
    else novaGroupColor = 'text-yellow-500 border-yellow-500';

    return (
        <Card className="p-4 border-l-4 border-green-500 bg-white dark:bg-gray-800 relative">
            <button
                onClick={onClose} // Esto ahora es seguro
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar detalles"
            >
                &times;
            </button>
            <h4 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">{product.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Marca: {product.brand} | Código: {product.code}</p>
            
            <div className="flex flex-wrap gap-4 items-center mb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className={`px-4 py-2 rounded-lg text-lg font-extrabold shadow-md ${nutriscoreColor}`}>
                    Nutri-Score: {product.nutriscoreGrade}
                </div>
                <div className={`px-4 py-2 rounded-lg text-lg font-bold border-2 ${novaGroupColor}`}>
                    NOVA Group: {product.novaGroup}
                </div>
            </div>

            {score !== undefined && (
              <p className="text-sm font-semibold text-blue-600 mb-2">Score personalizado: {score}</p>
            )}

            <h5 className="font-semibold text-base mt-4 mb-2 text-gray-900 dark:text-white border-b pb-1">Nutrición (por 100g)</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Calorías:</strong> {product.calories} kcal</p>
                <p><strong>Proteínas:</strong> {product.protein} g</p>
                <p><strong>Carbohidratos:</strong> {product.carbs} g</p>
                <p><strong>Grasas:</strong> {product.fat} g</p>
            </div>
            <p className="text-xs mt-3 text-gray-500 dark:text-gray-500">
                Tamaño de la porción: {product.servingSize}g.
            </p>
        </Card>
    );
}

export default ProductCard;
