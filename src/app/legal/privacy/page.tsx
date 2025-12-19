// apps/web/src/app/legal/privacy/page.tsx
import React from 'react';

export const metadata = {
  title: 'Política de Privacidad | Sporvit Legal',
  description: 'Descubra cómo Sporvit recopila, utiliza y protege sus datos personales y de salud.',
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

export default function PrivacyPage() {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
          Política de Privacidad
        </h1>
        <p className="text-slate-500 text-sm">
          Última actualización: <span className="text-emerald-400">1 de diciembre de 2025</span>
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6 md:p-10 border border-slate-800 backdrop-blur-sm shadow-xl">
         
         <SectionTitle>1. Introducción y Ámbito</SectionTitle>
         <Paragraph>
           Sporvit ("nosotros", "nuestro" o "la App") se compromete a proteger su privacidad. Esta Política de Privacidad explica qué información personal recopilamos, cómo la utilizamos y qué medidas tomamos para protegerla.
         </Paragraph>

         <SectionTitle>2. Información que Recopilamos</SectionTitle>
         <SubSectionTitle>2.1. Información de la Cuenta</SubSectionTitle>
         <Paragraph>
           Recopilamos información necesaria para la creación de su cuenta, como su nombre, dirección de correo electrónico, y datos de inicio de sesión de terceros (si aplica).
         </Paragraph>
         
         <SubSectionTitle>2.2. Datos de Salud y Bienestar (Datos Sensibles)</SubSectionTitle>
         <Paragraph>
           Para proporcionar un servicio de nutrición y fitness personalizado, recopilamos la siguiente información sensible, basada en sus entradas:
         </Paragraph>
         <List>
           <ListItem><strong className="text-white">Perfil y Biometría:</strong> Edad, género, altura, peso actual, porcentaje de grasa corporal, nivel de actividad y días de entrenamiento por semana.</ListItem>
           <ListItem><strong className="text-white">Metas:</strong> Tipo de objetivo (corte, volumen, mantenimiento), peso objetivo, y metas calóricas/macro calculadas.</ListItem>
           <ListItem><strong className="text-white">Seguimiento Diario:</strong> Entradas de comidas y productos escaneados (nutrición), entrenamientos realizados (fitness), y seguimiento de progreso (peso, medidas corporales).</ListItem>
           <ListItem><strong className="text-white">Preferencias:</strong> Tipo de dieta, alergias e ingredientes excluidos.</ListItem>
         </List>
         <Paragraph>
           El tratamiento de estos datos sensibles se realiza bajo su consentimiento explícito para optimizar su experiencia con el servicio de IA.
         </Paragraph>

         <SubSectionTitle>2.3. Datos de Uso y Técnicos</SubSectionTitle>
         <Paragraph>
           Recopilamos información sobre cómo utiliza la App, así como datos técnicos sobre su dispositivo (tipo de dispositivo, sistema operativo, etc.) para mejorar la calidad y la seguridad del servicio.
         </Paragraph>


         <SectionTitle>3. Cómo Utilizamos su Información</SectionTitle>
         <Paragraph>
           Utilizamos la información recopilada exclusivamente para los siguientes fines:
         </Paragraph>
         <List>
           <ListItem>Proporcionar y personalizar el contenido de nutrición y fitness generado por IA.</ListItem>
           <ListItem>Realizar un seguimiento de su progreso y ajustar sus metas.</ListItem>
           <ListItem>Mejorar, mantener y analizar el rendimiento de la App.</ListItem>
           <ListItem>Comunicarnos con usted sobre actualizaciones del servicio o asuntos de seguridad.</ListItem>
         </List>
         
         <SectionTitle>4. Compartición y Divulgación de Datos</SectionTitle>
         <Paragraph>
           <strong className="text-red-400">No vendemos, alquilamos ni comercializamos</strong> sus datos personales o de salud. Solo compartimos su información en los siguientes casos:
         </Paragraph>
         <List>
           <ListItem>Con <strong className="text-white">Proveedores de Servicios:</strong> Terceros que nos ayudan a operar la App (ej. alojamiento de bases de datos, análisis), quienes están obligados por contrato a proteger su información.</ListItem>
           <ListItem>Por <strong className="text-white">Obligación Legal:</strong> Si así lo exige una orden judicial o una ley aplicable.</ListItem>
           <ListItem>Con <strong className="text-white">Su Consentimiento:</strong> Si usted nos da permiso explícito para compartir su información.</ListItem>
         </List>

         <SectionTitle>5. Seguridad de Datos</SectionTitle>
         <Paragraph>
           Implementamos medidas de seguridad técnicas y organizativas rigurosas, incluyendo cifrado y controles de acceso, para proteger sus datos personales y, en particular, sus datos de salud contra el acceso no autorizado, la divulgación, la alteración o la destrucción.
         </Paragraph>
         
         <SectionTitle>6. Sus Derechos</SectionTitle>
         <Paragraph>
           Usted tiene derecho a acceder, corregir o eliminar sus datos personales. Puede ejercer estos derechos directamente a través de la configuración de su cuenta o contactándonos.
         </Paragraph>

         <div className="mt-12 pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500 text-center">
              Para preguntas sobre esta Política, contáctenos en <a href="mailto:privacy@sporvit.com" className="text-emerald-400 hover:text-emerald-300">privacy@sporvit.com</a>.
            </p>
         </div>
      </div>
    </>
  );
}