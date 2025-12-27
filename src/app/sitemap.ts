// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPlans, getAllObjetivos } from '@/lib/data/trainingPlans';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sporvit.com';
  
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/planes-entrenamiento`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ];

  // Páginas de objetivos
  const objetivos = getAllObjetivos();
  const objetivoPages: MetadataRoute.Sitemap = objetivos.map(objetivo => ({
    url: `${baseUrl}/planes-entrenamiento/${objetivo}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  // Todas las páginas de planes individuales
  const plans = getAllPlans();
  const planPages: MetadataRoute.Sitemap = plans.map(plan => ({
    url: `${baseUrl}/plan/${plan.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [...staticPages, ...objetivoPages, ...planPages];
}