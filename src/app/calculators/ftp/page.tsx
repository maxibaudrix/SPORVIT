import { Metadata } from 'next';
import FTPCalculator from './FTPCalculator';

export const metadata: Metadata = {
  title: 'Estimador de FTP Ciclismo | Test de 20 min y Rampa | Sporvit',
  description: 'Calcula tu FTP (Umbral de Potencia Funcional) y define tus zonas de entrenamiento por vatios. Herramienta esencial para ciclistas de carretera, MTB y triatlón.',
  keywords: 'calcular ftp ciclismo, estimador ftp vatios, zonas potencia ciclismo, test rampa ftp, test 20 min ciclismo, vatios por kilo, andrew coggan zones',
  alternates: { canonical: 'https://sporvit.com/calculadoras/estimador-de-ftp' },
  openGraph: {
    title: 'Estimador de FTP: Domina tu Potencia en Ciclismo | Sporvit',
    description: 'Calcula tu umbral de vatios y entrena como un profesional.',
    url: 'https://sporvit.com/calculadoras/estimador-de-ftp',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Estimador de FTP Sporvit",
    "description": "Calculadora de potencia umbral funcional para ciclistas basada en tests de campo.",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "All",
    "featureList": ["Test 20 minutos", "Test de Rampa", "Zonas de Coggan", "Ratio W/kg"]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FTPCalculator />
    </>
  );
}