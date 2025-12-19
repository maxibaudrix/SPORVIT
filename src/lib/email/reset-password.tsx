// src/lib/email/templates/reset-password.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ResetPasswordEmailProps {
  name?: string
  resetLink: string
}

export const ResetPasswordEmail = ({
  name = 'Usuario',
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña de Sporvit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔒 Restablece tu contraseña</Heading>
          <Text style={text}>Hola {name},</Text>
          <Text style={text}>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de Sporvit.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Restablecer contraseña
            </Button>
          </Section>
          <Text style={text}>
            Este enlace es válido por <strong>1 hora</strong>.
          </Text>
          <Text style={text}>
            Si no solicitaste este cambio, puedes ignorar este email de forma segura.
          </Text>
          <Text style={footer}>
            © 2024 Sporvit. Todos los derechos reservados.
            <br />
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/legal/privacy`} style={link}>
              Política de Privacidad
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail

// Estilos
const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const h1 = {
  color: '#fff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '32px 0 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#10b981',
  textDecoration: 'underline',
}