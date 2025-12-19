// src/app/api/contact/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}


// Simulación de servicio de email (Resend / SendGrid)
async function sendEmail(data: any) {
  // AQUÍ IRÍA LA LÓGICA REAL DE RESEND:
  // await resend.emails.send({ from: '...', to: 'support@sporvit.com', ... })
  
  console.log("📧 [Email Service Mock] Enviando correo:", data);
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Simular delay de red
}

export async function POST(req: NextRequest) {
  try {
    // Extraer y tipar los datos del cuerpo de la solicitud
    const data: ContactFormData = await req.json();

    // 1. Validación (Reemplazando el uso de 'contactFormSchema' externo)
    if (!data.name || !data.email || !data.message) {
      console.warn('Validation Failed: Missing required fields');
      return NextResponse.json(
        { message: 'Missing required fields: name, email, and message are required.' }, 
        { status: 400 }
      );
    }

      // Simular server-side processing delay (e.g., guardar en DB, enviar email)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // 2. Simular Error de servicio (igual que en el cliente)
    if (data.email.toLowerCase().includes('error')) {
      console.error('Simulated Service Error for email:', data.email);
      return NextResponse.json(
        { message: 'Failed to send email. Service temporarily unavailable.' },
        { status: 503 } // Service Unavailable
      );
    }

  } catch (error) {
    console.error("Error en /api/contact/submit:", error);
    return NextResponse.json(
      { error: "Hubo un problema interno al enviar el mensaje." },
      { status: 500 }
    );
  }
}