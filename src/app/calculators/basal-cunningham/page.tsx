import { Metadata } from 'next';
import CunninghamCalculator from './CunninghamCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Metabolismo Cunningham | Masa Libre de Grasa | Sporvit',
  description: 'Calcula tu gasto metabólico basal con la fórmula de Cunningham. La herramienta más precisa para atletas y culturistas basada en la masa libre de grasa (LBM).',
  keywords: 'formula cunningham metabolismo, calcular bmr atletas, masa libre de grasa metabolismo, gasto basal culturismo, nutricion deportiva avanzada, lbm basal rate',
  alternates: { canonical: 'https://sporvit.com/calculadoras/calculadora-metabolismo-basal-cunningham' },
  openGraph: {
    title: 'Fórmula de Cunningham: Precisión Metabólica para Atletas | Sporvit',
    description: 'Determina tus necesidades calóricas reales según tu masa muscular.',
    url: 'https://sporvit.com/calculadoras/calculadora-metabolismo-basal-cunningham',
    type: 'website',
    images: [{ url: '/og-cunningham.jpg', width: 1200, height: 630, alt: 'Calculadora Cunningham Sporvit' }],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Cunningham Sporvit",
    "description": "Herramienta de precisión para el cálculo de la tasa metabólica basal en poblaciones atléticas.",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "All",
    "featureList": [
      "Cálculo basado en Masa Libre de Grasa (LBM)",
      "Precisión superior para culturistas",
      "Interfaz optimizada para alto rendimiento",
      "Código embed profesional"
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CunninghamCalculator />
      
      {/* SECCIÓN SEO ADICIONAL (ARTÍCULO DE AUTORIDAD) */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <article className="prose prose-invert prose-slate max-w-none">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">
            Cunningham: La Fórmula que Entiende el Músculo
          </h2>
          <div className="space-y-6 text-slate-400 text-lg leading-relaxed text-justify">
            <p>
              Mientras que ecuaciones como Harris-Benedict o Mifflin-St Jeor son excelentes para la población general, suelen fallar cuando se aplican a atletas con una composición corporal fuera de la norma. El problema radica en que esas fórmulas utilizan el <strong>peso total</strong>, asumiendo una proporción de grasa estándar.
            </p>
            <p>
              La <strong>Fórmula de Cunningham</strong> elimina el ruido de la grasa corporal y se centra exclusivamente en el tejido metabólicamente activo: la <strong>Masa Libre de Grasa (LBM)</strong>. El músculo es un tejido costoso de mantener para el cuerpo humano, y Cunningham cuantifica ese gasto con una precisión quirúrgica:
            </p>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-indigo-400 text-xl my-8">
              {"$$RMR = 500 + (22 \\times LBM\\text{ en kg})$$"}
            </div>
            <h3 className="text-white font-bold italic text-2xl">¿Por qué usar Cunningham en el Fitness Pro?</h3>
            <p>
              Si eres un culturista en fase de volumen o un atleta de CrossFit con un porcentaje de grasa bajo, tu metabolismo es una "hoguera" comparado con una persona sedentaria del mismo peso. Cunningham evita que subestimes tus necesidades calóricas, lo que previene el estancamiento y la pérdida de tejido magro durante fases críticas.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}