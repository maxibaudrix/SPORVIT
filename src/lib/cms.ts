/**
 * src/lib/cms.ts
 * * Este archivo simula la conexión a un CMS (Content Management System) externo
 * y proporciona los tipos de datos necesarios para que src/app/blog/page.tsx compile.
 */

// --- Tipado de Datos ---
export interface BlogPost {
  title: string;
  slug: string;
  category: "Nutrición" | "Entrenamiento" | "Ciencia" | "Recetas";
  readingTime: number; // Tiempo en minutos
  summary: string;
  date: string; // Formato YYYY-MM-DD
  imageUrl: string; // URL de imagen de portada (simulada)
  isFeatured?: boolean;
  coverImage: string;
  content: string;
  excerpt: string;
  readTime: string;
  author: {
  name: string;
  image: string;
  role: string;
  bio: string;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
};
};

// --- Funciones del CMS ---

export async function getFeaturedPost(): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return DUMMY_POSTS[0];
}

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return category
    ? DUMMY_POSTS.filter(post => post.category === category)
    : DUMMY_POSTS;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return DUMMY_POSTS.find(post => post.slug === slug) || null;
}

export async function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const current = DUMMY_POSTS.find(p => p.slug === slug);
  if (!current) return [];
  return DUMMY_POSTS
    .filter(p => p.slug !== slug && p.category === current.category)
    .slice(0, 3);
}

const DUMMY_POSTS: BlogPost[] = [
  {
    title: 'La Guía Definitiva de Proteínas y Masa Muscular',
    slug: 'guia-proteinas-musculo',
    category: 'Nutrición',
    readingTime: 8,
    summary: 'Descubre cuánta proteína necesitas realmente...',
    date: '2025-11-20',
    imageUrl: 'https://placehold.co/800x450/111827/4ade80?text=Proteínas',

    coverImage: 'https://placehold.co/800x450/111827/4ade80?text=Proteínas',
    excerpt: 'Aprende cómo optimizar tu ingesta de proteínas para ganar más masa muscular con evidencia científica.',
    readTime: '8 min',
    content: `
## Introducción
Las proteínas son esenciales para la recuperación muscular y el crecimiento...

## ¿Cuánta proteína necesito?
La cantidad ideal depende del nivel de actividad, peso y objetivo...

## Conclusión
Optimizar la ingesta diaria aumenta el rendimiento y favorece la hipertrofia.
    `,
    author: {
      name: 'Equipo Sporvit',
      image: 'https://placehold.co/100x100/0f172a/4ade80?text=A',
      role: 'Investigador en Ciencia del Deporte',
      bio: 'Especialista en nutrición deportiva, optimización metabólica y rendimiento.',
      social: {
        twitter: 'sporvit',
        instagram: 'sporvit',
      }
    }
  },

  {
    title: 'Optimiza tu Dormir para Aumentar tu Rendimiento',
    slug: 'dormir-rendimiento',
    category: 'Entrenamiento',
    readingTime: 6,
    summary: 'El sueño es tu herramienta de recuperación más poderosa...',
    date: '2025-11-15',
    imageUrl: 'https://placehold.co/800x450/111827/a78bfa?text=Dormir',

    coverImage: 'https://placehold.co/800x450/111827/a78bfa?text=Dormir',
    excerpt: 'Dormir bien es fundamental para la recuperación. Te enseñamos cómo mejorarlo.',
    readTime: '6 min',
    content: `
## Importancia del sueño
Dormir afecta la recuperación, el rendimiento y el humor...

## Estrategias
Rutinas de descanso, higiene del sueño, horarios óptimos...

## Conclusión
Dormir mejor es una de las formas más fáciles de mejorar tu rendimiento.
    `,
    author: {
      name: 'Equipo Sporvit',
      image: 'https://placehold.co/100x100/0f172a/a78bfa?text=A',
      role: 'Especialista en Recuperación',
      bio: 'Años investigando la relación entre el sueño, la energía y la productividad.',
      social: {
        twitter: 'sporvit',
      }
    }
  },

  {
    title: 'Mitos Comunes en la Suplementación Deportiva',
    slug: 'mitos-suplementos',
    category: 'Ciencia',
    readingTime: 10,
    summary: 'Desmentimos los suplementos que no funcionan...',
    date: '2025-10-28',
    imageUrl: 'https://placehold.co/800x450/111827/f87171?text=Mitos',

    coverImage: 'https://placehold.co/800x450/111827/f87171?text=Mitos',
    excerpt: 'Muchos suplementos no funcionan. Descubre cuáles sí están respaldados por evidencia.',
    readTime: '10 min',
    content: `
## Introducción
El mundo de los suplementos está lleno de marketing engañoso...

## Suplementos que no funcionan
Listamos los que menos evidencia tienen...

## Suplementos útiles
Creatina, cafeína, proteína, vitamina D...
    `,
    author: {
      name: 'Equipo Sporvit',
      image: 'https://placehold.co/100x100/0f172a/f87171?text=A',
      role: 'Investigador en Nutrición Deportiva',
      bio: 'Enfocado en separar ciencia real del marketing en la industria fitness.',
      social: {
        twitter: 'sporvit',
        linkedin: 'sporvit'
      }
    }
  },

  {
    title: 'Receta: Bowl Energético de Avena y Frutos Rojos',
    slug: 'receta-avena-frutos-rojos',
    category: 'Recetas',
    readingTime: 4,
    summary: 'Desayuno delicioso lleno de antioxidantes...',
    date: '2025-10-10',
    imageUrl: 'https://placehold.co/800x450/111827/fcd34d?text=Receta',

    coverImage: 'https://placehold.co/800x450/111827/fcd34d?text=Receta',
    excerpt: 'Una receta práctica y deliciosa para cargar energía antes de tus entrenamientos.',
    readTime: '4 min',
    content: `
## Ingredientes
Avena, frutos rojos, yogur, miel...

## Preparación
Mezclar, servir y disfrutar...

## Beneficios
Lleno de carbohidratos complejos y antioxidantes.
    `,
    author: {
      name: 'Equipo Sporvit',
      image: 'https://placehold.co/100x100/0f172a/fcd34d?text=A',
      role: 'Chef deportivo',
      bio: 'Especialista en recetas saludables para deportistas.',
      social: {
        instagram: 'sporvit'
      }
    }
  },

  {
    title: 'Entrenamiento HIIT vs LISS: ¿Cuál es mejor para quemar grasa?',
    slug: 'hitt-vs-liss',
    category: 'Entrenamiento',
    readingTime: 7,
    summary: 'Comparamos alta y baja intensidad...',
    date: '2025-09-01',
    imageUrl: 'https://placehold.co/800x450/111827/22d3ee?text=Cardio',

    coverImage: 'https://placehold.co/800x450/111827/22d3ee?text=Cardio',
    excerpt: 'HIIT o LISS: analizamos cuál es más efectivo para quemar grasa según la ciencia.',
    readTime: '7 min',
    content: `
## ¿Qué es HIIT?
Entrenamiento por intervalos de alta intensidad...

## ¿Qué es LISS?
Cardio estable de baja intensidad...

## ¿Cuál es mejor?
Depende de tu nivel, tiempo y objetivo.
    `,
    author: {
      name: 'Equipo Sporvit',
      image: 'https://placehold.co/100x100/0f172a/22d3ee?text=A',
      role: 'Entrenador especializado en resistencia',
      bio: 'Apasionado por el cardio inteligente y la planificación.\n',
      social: {
        twitter: 'sporvit'
      }
    }
  }
];
