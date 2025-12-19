import { Header } from '@/components/ui/layout/public/Header';
import { Footer } from '@/components/ui/layout/public/Footer'; // Versión grande

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header /> {/* Solo se verá en Home, About, Contact, etc. */}
      <main className="min-h-screen pt-16 pb-16">
        {children}
      </main>
      <Footer /> {/* Versión grande con todas las columnas */}
    </>
  );
}