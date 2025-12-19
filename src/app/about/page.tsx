import React from 'react';
import { 
  Users, Heart, Zap, Globe, ArrowRight, 
  Github, Twitter, Linkedin, Award, TrendingUp, ArrowLeft, Dumbbell
} from 'lucide-react';

export default function AboutPreview() {
  const stats = [
    { label: "Usuarios Activos", value: "50k+" },
    { label: "Comidas Escaneadas", value: "1.2M" },
    { label: "Países", value: "15" },
    { label: "Calificación App", value: "4.9" },
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "CEO & Co-Fundador",
      bio: "Ex-atleta olímpico convertido en ingeniero de software. Obsesionado con la optimización humana.",
      image: "https://placehold.co/400x400/1e293b/10b981?text=Alex",
    },
    {
      name: "Dra. Sarah Wu",
      role: "Chief Science Officer",
      bio: "PhD en Nutrición Deportiva. Asegura que cada algoritmo de Sporvit esté respaldado por la ciencia.",
      image: "https://placehold.co/400x400/1e293b/10b981?text=Sarah",
    },
    {
      name: "Mateo García",
      role: "CTO",
      bio: "Experto en IA y Visión por Computadora. El cerebro detrás de nuestro escáner de alimentos.",
      image: "https://placehold.co/400x400/1e293b/10b981?text=Mateo",
    },
    {
      name: "Elena Torres",
      role: "Head of Product",
      bio: "Diseñadora apasionada por crear experiencias que hacen que el fitness sea accesible para todos.",
      image: "https://placehold.co/400x400/1e293b/10b981?text=Elena",
    },
  ];

  const values = [
    {
      icon: Zap,
      title: "Innovación Radical",
      desc: "No nos conformamos con lo estándar. Usamos la última tecnología para resolver problemas antiguos de salud."
    },
    {
      icon: Heart,
      title: "Ciencia Primero",
      desc: "Sin modas pasajeras. Si no está respaldado por estudios revisados por pares, no entra en nuestra app."
    },
    {
      icon: Users,
      title: "Comunidad",
      desc: "Creemos que el viaje hacia la salud es mejor cuando se comparte. Fomentamos el apoyo mutuo."
    },
    {
      icon: Globe,
      title: "Accesibilidad",
      desc: "El coaching nutricional de élite no debería ser un lujo. Lo hacemos accesible para todos."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      
      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative py-24 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Nuestra Misión
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Democratizando el acceso al bienestar de élite
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Creemos que todo el mundo merece tener un nutricionista y un entrenador personal en su bolsillo. Usamos la Inteligencia Artificial para hacer que la salud personalizada sea accesible, precisa y fácil para todos.
            </p>
          </div>
        </section>

        {/* --- STATS --- */}
        <section className="border-y border-slate-900 bg-slate-900/30 py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-emerald-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- VALUES --- */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-slate-400">Los pilares que guían cada línea de código y cada plan nutricional.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((val, idx) => (
              <div key={idx} className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <val.icon className="w-6 h-6 text-slate-300 group-hover:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- STORY / ORIGIN --- */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/10 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                  <p>
                    Sporvit nació en 2022 de una frustración personal. Alex, nuestro fundador, se dio cuenta de que la mayoría de las apps de fitness eran solo hojas de cálculo glorificadas: requerían demasiada entrada manual y ofrecían poca personalización real.
                  </p>
                  <p>
                    "¿Por qué tengo que escribir 'avena' si puedo simplemente hacerle una foto?", se preguntó.
                  </p>
                  <p>
                    Unió fuerzas con Mateo y Sarah para construir una solución que combinara la visión por computadora de vanguardia con la ciencia nutricional más rigurosa. Lo que comenzó como un proyecto de fin de semana ahora ayuda a decenas de miles de personas a vivir mejor.
                  </p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <img 
                  src="https://placehold.co/800x1000/0f172a/10b981?text=Team+Working" 
                  alt="El equipo de Sporvit trabajando" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white font-bold text-lg">Oficinas Centrales</p>
                  <p className="text-emerald-400 text-sm">Barcelona, España</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TEAM --- */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Conoce al Equipo</h2>
            <p className="text-slate-400">Los humanos detrás de la IA.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-800 group-hover:border-emerald-500 transition-colors shadow-xl">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="pb-24 container mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">¿Quieres formar parte de esto?</h2>
              <p className="text-emerald-100 mb-8 text-lg">
                Siempre estamos buscando talento apasionado. Si crees que puedes ayudarnos a construir el futuro del fitness, queremos conocerte.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
                  Ver Posiciones Abiertas
                </button>
                <button className="px-8 py-3 bg-emerald-800/50 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors border border-emerald-700">
                  Contactar
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      </div>
  );
}