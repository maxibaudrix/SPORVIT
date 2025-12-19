// src/app/product/[id]/page.tsx
import React from "react";
import ProductCard from "@/components/scanner/ProductCard";


type Props = {
  params: { id: string };
};

// --- FUNCIÓN DE FETCH UNIFICADA ---
// Llama a tu propia API de scoring que, a su vez, llama a OpenFoodFacts.
async function fetchProductData(barcode: string) {
    // NOTA: Reemplaza o confirma el uso de process.env.NEXT_PUBLIC_BASE_URL si es necesario.
    // En entornos de Next.js App Router, puedes usar la ruta relativa /api/scanner
    // para las llamadas internas entre componentes de servidor y API routes.
    const res = await fetch(`http://localhost:3000/api/scanner`, { // Usamos localhost para ejemplo de llamada de server-side
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos el código y preferencias mínimas (maxNova: 3)
        body: JSON.stringify({ barcode: barcode, prefs: { maxNova: 3 } }),
        // Usamos el cache de Next.js para revalidación si lo deseas
        next: { revalidate: 60 * 60 } 
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        if (errorData.error === "product_not_found") {
            throw new Error("product_not_found");
        }
        throw new Error("API fetch failed: " + errorData.error);
    }
    
    const json = await res.json();
    return json; // Devuelve { product: rawOFFData, score: number }
}

export default async function ProductPage({ params }: Props) {
    const { id } = params;
    let data: { product: any, score: number | null } | null = null;
    let error: string | null = null;

    try {
        data = await fetchProductData(id);
    } catch (err: any) {
        console.error("Error al buscar el producto:", err.message);
        if (err.message.includes("product_not_found")) {
            error = "product_not_found";
        } else {
            error = "fetch_error";
        }
    }

    if (error === "product_not_found" || !data?.product) {
        return (
            <main className="p-6">
                <h1 className="text-xl font-bold">Producto no encontrado</h1>
                <p>Lo sentimos, no se encontró el producto con el código ${id}.</p>
            </main>
        );
    }

    const product = data.product;
    const score = data.score;
    // La prop 'product' debe coincidir con la interfaz ProductData de ProductCard. 
    // Si ProductCard espera el objeto mapeado (limpio), debes mapearlo aquí. 
    // Asumimos que ProductCard es lo suficientemente flexible para tomar el objeto crudo de OFF.

    return (
        <main className="p-6">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold mb-2">{product.product_name || "Producto sin nombre"}</h1>
                <p className="text-sm text-muted-foreground mb-4">{product.brands}</p>

                {/* ARREGLO DEL ERROR: Añadir la prop onClose */}
                <ProductCard 
                    product={product} 
                    score={score} 
                    onOpen={() => {}} 
                    onClose={() => {}} // <--- SOLUCIÓN AL ERROR 2741
                />

                <section className="mt-6">
                    <h2 className="text-lg font-semibold">Información nutricional (Cruda)</h2>
                    <pre className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-auto">
                        {JSON.stringify(product.nutriments ?? {}, null, 2)}
                    </pre>
                </section>

                <section className="mt-6">
                    <h2 className="text-lg font-semibold">Ingredientes</h2>
                    <p className="mt-2 text-sm">{product.ingredients_text || "No disponible"}</p>
                </section>
            </div>
        </main>
    );
}