// ============================================
// lib/email.ts
// Email sending utility
// ============================================

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Implementar con tu proveedor de email (SendGrid, Resend, etc.)
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email enviado:', {
      to: options.to,
      subject: options.subject
    });
    return true;
  }

  // Ejemplo con Resend:
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Sporvit <noreply@Sporvit.app>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
  */

  return true;
}

// Templates de email
export const emailTemplates = {
  welcome: (userName: string) => ({
    subject: '¡Bienvenido a Sporvit!',
    html: `
      <h1>¡Hola ${userName}!</h1>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Comienza ahora configurando tu plan personalizado.</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Ir al Dashboard</a>
    `
  }),

  planReady: (userName: string) => ({
    subject: 'Tu plan semanal está listo',
    html: `
      <h1>¡Hola ${userName}!</h1>
      <p>Tu plan de entrenamiento y nutrición de esta semana ya está disponible.</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Ver mi plan</a>
    `
  }),

  subscriptionActivated: (userName: string) => ({
    subject: '¡Bienvenido a Sporvit Premium!',
    html: `
      <h1>¡Felicidades ${userName}!</h1>
      <p>Ya eres miembro Premium de Sporvit.</p>
      <p>Ahora tienes acceso a todas las funciones avanzadas.</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/dashboard">Explorar funciones</a>
    `
  })
};