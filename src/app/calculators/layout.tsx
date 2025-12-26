// src/app/calculators/layout.tsx

import React from 'react';
import Script from 'next/script';
import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer';

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ID de Google Analytics (cambiar por el tuyo)
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Estructura de la página */}
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col">
        {/* Header Público */}
        <Header />



        {/* Contenido Principal */}

        <main className="flex-1 pt-16 pb-16">

          {children}

        </main>



        {/* Footer Público */}

        <Footer />

      </div>

    </>

  );

}