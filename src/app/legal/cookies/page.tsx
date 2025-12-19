// apps/web/src/app/legal/cookies/page.tsx
import React from 'react';

export const metadata = {
  title: 'Política de Cookies | Sporvit Legal',
  description: 'Información sobre el uso de cookies y tecnologías de seguimiento en Sporvit.',
};

// Componentes pequeños para estructurar el contenido
const SectionTitle = ({ children }: {children: React.ReactNode}) => (
  <h2 className="text-2xl font-bold text-white mt-8 mb-4 flex items-center gap-2 border-t border-slate-700 pt-4">{children}</h2>
);
const SubSectionTitle = ({ children }: {children: React.ReactNode}) => (
  <h3 className="text-xl font-semibold text-emerald-400 mt-6 mb-3">{children}</h3>
);
const Paragraph = ({ children }: {children: React.ReactNode}) => (
  <p className="text-slate-400 leading-relaxed mb-4 text-justify">{children}</p>
);
const List = ({ children }: {children: React.ReactNode}) => (
  <ul className="list-disc list-inside ml-4 space-y-2 text-slate-400 mb-4">{children}</ul>
);
const ListItem = ({ children }: {children: React.ReactNode}) => (
  <li className="text-justify">{children}</li>
);

export default function CookiesPage() {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
          Política de Cookies
        </h1>
        <p className="text-slate-500 text-sm">
          Última actualización: <span className="text-emerald-400">1 de diciembre de 2025</span>
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6 md:p-10 border border-slate-800 backdrop-blur-sm shadow-xl">
         
         <SectionTitle>1. ¿Qué son las Cookies?</SectionTitle>
         <Paragraph>
           Las cookies son pequeños archivos de texto que se almacenan en su navegador o dispositivo cuando visita nuestro sitio web o utiliza nuestra App. Las utilizamos para recordar su información de inicio de sesión y sus preferencias, proporcionando una experiencia más fluida y personalizada.
         </Paragraph>

         <SectionTitle>2. Tipos de Cookies que Utilizamos</SectionTitle>
         
         <SubSectionTitle>2.1. Cookies Esenciales (Necesarias)</SubSectionTitle>
         <Paragraph>
           Estas cookies son estrictamente necesarias para el funcionamiento del Servicio. Permiten funciones básicas como la autenticación de usuarios y la seguridad de la cuenta. <strong className="text-emerald-400">No se pueden desactivar.</strong>
         </Paragraph>

         <SubSectionTitle>2.2. Cookies de Rendimiento y Análisis</SubSectionTitle>
         <Paragraph>
           Estas cookies nos ayudan a entender cómo interactúan los usuarios con Sporvit, proporcionándonos información sobre las páginas más visitadas y los posibles errores. La información es agregada y anónima.
         </Paragraph>
         <List>
           <ListItem>Utilizadas para medir el tráfico y el rendimiento de la aplicación.</ListItem>
           <ListItem>Nos permiten mejorar la experiencia del usuario y corregir errores.</ListItem>
         </List>

         <SubSectionTitle>2.3. Cookies de Funcionalidad</SubSectionTitle>
         <Paragraph>
           Estas cookies permiten que la App recuerde las elecciones que usted hace (como su idioma o región) y proporcionan características mejoradas y más personales.
         </Paragraph>
         
         <SectionTitle>3. Gestión de Cookies</SectionTitle>
         <Paragraph>
           Al utilizar Sporvit, usted acepta el uso de cookies de acuerdo con esta política. Usted tiene el control para aceptar o rechazar las cookies no esenciales.
         </Paragraph>
         <List>
           <ListItem><strong className="text-white">Configuración del Navegador:</strong> Puede configurar su navegador para que rechace todas o algunas cookies, o para que le avise cuando se envíen cookies.</ListItem>
           <ListItem><strong className="text-white">Configuración de la Aplicación:</strong> La configuración de preferencias de cookies no esenciales también estará disponible dentro de la App.</ListItem>
         </List>
         <Paragraph>
           Tenga en cuenta que si desactiva las cookies esenciales, algunas partes del Servicio pueden volverse inaccesibles o no funcionar correctamente.
         </Paragraph>

         <div className="mt-12 pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500 text-center">
              Para preguntas sobre nuestra Política de Cookies, contáctenos en <a href="mailto:privacy@sporvit.com" className="text-emerald-400 hover:text-emerald-300">privacy@sporvit.com</a>.
            </p>
         </div>
      </div>
    </>
  );
}