// apps/web/src/app/legal/terms/page.tsx
import React from 'react';

export const metadata = {
  title: 'Términos y Condiciones | Sporvit Legal',
  description: 'Lee los términos de uso de Sporvit, la plataforma de nutrición impulsada por IA.',
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

export default function TermsPage() {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-slate-500 text-sm">
          Última actualización: <span className="text-emerald-400">1 de diciembre de 2025</span>
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6 md:p-10 border border-slate-800 backdrop-blur-sm shadow-xl">
         
         <SectionTitle>1. Aceptación de los Términos</SectionTitle>
         <Paragraph>
           Al acceder y utilizar el servicio Sporvit (la "App" o "Servicio"), usted ("Usuario") acepta estar legalmente obligado por los presentes Términos y Condiciones de Uso ("Términos"). Si no está de acuerdo con alguna parte de estos Términos, no debe utilizar el Servicio.
         </Paragraph>

         <SectionTitle>2. Descripción del Servicio</SectionTitle>
         <Paragraph>
           Sporvit es una aplicación móvil y plataforma web que ofrece herramientas de nutrición personalizadas basadas en IA, seguimiento de progreso, planificación de comidas y rutinas de ejercicio, diseñadas para ayudar a los usuarios a alcanzar sus objetivos de salud.
         </Paragraph>

         <SectionTitle>3. Uso del Servicio</SectionTitle>
         <SubSectionTitle>3.1. Elegibilidad</SubSectionTitle>
         <Paragraph>
           El Servicio está destinado a usuarios mayores de 18 años. Al utilizar el Servicio, usted declara y garantiza que tiene la capacidad legal para aceptar estos Términos.
         </Paragraph>
         
         <SubSectionTitle>3.2. Cuentas de Usuario</SubSectionTitle>
         <Paragraph>
           Usted es responsable de mantener la confidencialidad de la información de su cuenta y contraseña. Toda actividad que ocurra bajo su cuenta es su responsabilidad.
         </Paragraph>
         
         <SubSectionTitle>3.3. Advertencia de Salud (Descargo de Responsabilidad)</SubSectionTitle>
         <Paragraph>
           Sporvit <strong className="text-red-400">NO es un servicio médico</strong>. La información proporcionada (planes de comidas, consejos, macros) tiene fines informativos y de bienestar general. 
           <strong className="text-emerald-400">Siempre debe consultar a un médico o nutricionista profesional</strong> antes de comenzar cualquier plan de dieta o ejercicio, especialmente si padece alguna condición médica preexistente.
         </Paragraph>

         <SectionTitle>4. Suscripciones y Pagos</SectionTitle>
         <Paragraph>
           El Servicio puede ofrecer planes de suscripción de pago ("Planes Pro").
         </Paragraph>
         <List>
           <ListItem><strong className="text-white">Facturación:</strong> El pago se procesará a través de la plataforma (App Store, Google Play o Stripe) y se facturará de forma recurrente (mensual o anual).</ListItem>
           <ListItem><strong className="text-white">Cancelación:</strong> Puede cancelar su suscripción en cualquier momento desde la configuración de su cuenta. La cancelación será efectiva al final del ciclo de facturación actual.</ListItem>
         </List>

         <SectionTitle>5. Propiedad Intelectual</SectionTitle>
         <Paragraph>
           Todo el contenido, diseño, logotipos, código fuente y material generado por Sporvit son propiedad exclusiva de Sporvit o sus licenciantes y están protegidos por las leyes de propiedad intelectual.
         </Paragraph>

         <SectionTitle>6. Limitación de Responsabilidad</SectionTitle>
         <Paragraph>
           Sporvit no será responsable de ningún daño directo, indirecto, incidental o consecuente que resulte del uso o la incapacidad de usar el Servicio.
         </Paragraph>

         <SectionTitle>7. Cambios en los Términos</SectionTitle>
         <Paragraph>
           Nos reservamos el derecho de modificar estos Términos en cualquier momento. Se le notificará cualquier cambio sustancial por correo electrónico o a través de la App.
         </Paragraph>
         
         <div className="mt-12 pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500 text-center">
              Para preguntas sobre estos Términos, contáctenos en <a href="mailto:legal@sporvit.com" className="text-emerald-400 hover:text-emerald-300">legal@sporvit.com</a>.
            </p>
         </div>
      </div>
    </>
  );
}