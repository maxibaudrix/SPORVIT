// src/lib/email/send-email.ts
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { ReactElement } from 'react'

interface SendEmailOptions {
  to: string
  subject: string
  react: ReactElement
}

// Configurar transporter según tu proveedor
// Opciones: Gmail, SendGrid, AWS SES, Resend, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const html = render(react)

    const info = await transporter.sendMail({
      from: `"Sporvit" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    })

    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, error }
  }
}