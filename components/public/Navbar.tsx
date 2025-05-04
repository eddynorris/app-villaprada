import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-white">
      <Link href="/" className="text-burgundy-700 text-2xl font-serif">
        Fiesta Elegante
      </Link>
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-gray-800 hover:text-burgundy-600">
          Inicio
        </Link>
        <Link href="/catalog" className="text-gray-800 hover:text-burgundy-600">
          Catálogo
        </Link>
        <Link href="/availability" className="text-gray-800 hover:text-burgundy-600">
          Calendario
        </Link>
        <Link href="/request-booking" className="text-gray-800 hover:text-burgundy-600">
          Reservar
        </Link>
        <Link 
          href="/contact" 
          className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600"
        >
          Contacto
        </Link>
        <Link 
          href="/admin/login" 
          className="text-sm text-gray-600 hover:text-burgundy-600 ml-4"
        >
          Login
        </Link>
      </div>
    </nav>
  );
} 