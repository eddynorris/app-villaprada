"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? "text-burgundy-700 font-semibold" : "text-gray-700 hover:text-burgundy-600";
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-burgundy-700 text-2xl font-serif flex items-center space-x-2">
          <Image 
            src="/window.svg" 
            alt="Fiesta Elegante Logo" 
            width={28} 
            height={28} 
            className="text-burgundy-700"
          />
          <span>Fiesta Elegante</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`${isActive('/')} transition-colors`}>
            Inicio
          </Link>
          <Link href="/catalog" className={`${isActive('/catalog')} transition-colors`}>
            Catálogo
          </Link>
          <Link href="/availability" className={`${isActive('/availability')} transition-colors`}>
            Calendario
          </Link>
          <Link href="/request-booking" className={`${isActive('/request-booking')} transition-colors`}>
            Reservar
          </Link>
          <Link 
            href="/contact" 
            className={`${
              pathname === '/contact' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            } py-2 px-4 rounded transition-colors`}
          >
            Contacto
          </Link>
        </nav>
        
        {/* Botón para móvil */}
        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 