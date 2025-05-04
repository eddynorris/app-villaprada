"use client";

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { PLACEHOLDER_IMAGES } from '@/lib/constants';

export default function HomePage() {
  // Bandera para controlar si usamos una imagen real o un fondo de color
  const useRealImage = true; // Usamos la imagen de Unsplash

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-burgundy-800 text-white">
        {useRealImage ? (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <Image 
              src={PLACEHOLDER_IMAGES.HERO}
              alt="Celebraciones elegantes" 
              fill 
              className="object-cover"
              quality={90}
              priority
              onError={(e) => {
                // Si hay error al cargar la imagen, se reemplaza con el componente window.svg
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'flex items-center justify-center h-full w-full';
                  fallback.innerHTML = '<img src="/window.svg" alt="Celebraciones elegantes" class="w-24 h-24 opacity-30" />';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        ) : (
          // Fondo alternativo si no hay imagen
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-700 to-burgundy-900 flex items-center justify-center">
            <Image 
              src="/window.svg" 
              alt="Fiesta Elegante" 
              width={120} 
              height={120} 
              className="opacity-20"
            />
          </div>
        )}
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Creamos eventos inolvidables
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Transforma tus celebraciones con nuestro exclusivo servicio de eventos sociales y catering de lujo
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/catalog">
                <Button variant="primary" size="lg">Ver espacios</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/20">
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Espacios elegantes</h3>
              <p className="text-gray-600">Amplios salones y espacios al aire libre para todo tipo de eventos y celebraciones.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Paquetes personalizados</h3>
              <p className="text-gray-600">Opciones flexibles para adaptarse a tus necesidades y presupuesto.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Catering de lujo</h3>
              <p className="text-gray-600">Menús exclusivos preparados por chefs profesionales para deleitar a tus invitados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-burgundy-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-burgundy-700 font-bold">MC</span>
                </div>
                <div>
                  <h4 className="font-bold">María Casas</h4>
                  <p className="text-sm text-gray-600">Boda, Mayo 2023</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Nuestra boda fue absolutamente perfecta gracias a Fiesta Elegante. 
                El servicio fue impecable y nuestros invitados quedaron encantados."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-burgundy-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-burgundy-700 font-bold">JL</span>
                </div>
                <div>
                  <h4 className="font-bold">Juan López</h4>
                  <p className="text-sm text-gray-600">Corporativo, Diciembre 2022</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Organizamos nuestro evento de fin de año con Fiesta Elegante y superó 
                nuestras expectativas. Profesionales en todo momento."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-burgundy-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-burgundy-700 font-bold">AR</span>
                </div>
                <div>
                  <h4 className="font-bold">Ana Rodríguez</h4>
                  <p className="text-sm text-gray-600">Cumpleaños, Marzo 2023</p>
                </div>
              </div>
              <p className="text-gray-700">
                "El cumpleaños de mi hija fue mágico. La decoración, la comida, 
                todo fue exactamente como lo imaginamos. ¡Repetiremos seguro!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-burgundy-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para crear tu evento soñado?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contáctanos hoy mismo y permite que nuestro equipo de expertos te ayude a planificar el evento perfecto.
          </p>
          <Link href="/request-booking">
            <Button variant="primary" size="lg">
              Solicitar reserva
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
} 