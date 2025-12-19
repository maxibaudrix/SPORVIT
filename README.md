# 🏋️ Sporvit MVP

Tu nutricionista y entrenador IA de bolsillo.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Autenticación:** NextAuth v5
- **Estilos:** TailwindCSS + shadcn/ui
- **State Management:** Zustand
- **Validación:** Zod
- **Deploy:** Vercel

## 🛠️ Setup Local

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Generar Prisma Client
pnpm prisma:generate

# Push schema a la base de datos
pnpm prisma:push

# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/              # App Router (páginas y API routes)
├── components/       # Componentes React
├── lib/              # Lógica de negocio y utilidades
├── store/            # Estado global (Zustand)
├── types/            # Definiciones TypeScript
└── utils/            # Funciones helper
```

## 🎯 Business Cases (MVP)

- **BC1:** Smart Product Scanner
- **BC2:** Adaptive Training Engine
- **BC3:** Recipe Generator from Pantry

## 📝 Scripts Disponibles

```bash
pnpm dev          # Desarrollo
pnpm build        # Build producción
pnpm start        # Servidor producción
pnpm lint         # Linter
pnpm type-check   # Verificar tipos
```

## 🚢 Deploy

Este proyecto está configurado para deploy automático en Vercel.

```bash
# Conectar con Vercel
vercel

# Deploy a producción
vercel --prod
```

## 📄 Licencia

Privado - Todos los derechos reservados
