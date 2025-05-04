import Header from '@/components/public/Header';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-burgundy-950 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fiesta Elegante</h3>
              <p className="text-gray-300">Transformamos tus celebraciones en eventos inolvidables.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <address className="not-italic text-gray-300">
                <p>Av. Principal 123, Col. Centro</p>
                <p>Tel: (555) 123-4567</p>
                <p>info@fiestaelegante.com</p>
              </address>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Horario</h3>
              <p className="text-gray-300">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-300">Sábados: 10:00 AM - 3:00 PM</p>
            </div>
          </div>
          <div className="mt-8 border-t border-burgundy-800 pt-4 text-gray-400 text-center text-sm">
            © {new Date().getFullYear()} Fiesta Elegante. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
} 