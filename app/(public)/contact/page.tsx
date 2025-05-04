"use client";

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-burgundy-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Contacto</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a crear el evento perfecto.
          </p>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Dirección</h3>
                  <address className="not-italic text-gray-600">
                    Av. Principal 123, Col. Centro, Ciudad
                  </address>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Teléfono</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600">info@fiestaelegante.com</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Horario de Atención</h3>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sábados: 10:00 AM - 3:00 PM</p>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-gray-500 text-center p-4">
                  <p>Mapa interactivo de ubicación</p>
                  <p className="text-sm">(En una implementación real, aquí iría un mapa de Google Maps o similar)</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
              
              <form className="space-y-6">
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Tu nombre"
                  required
                />
                
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
                
                <Input
                  label="Asunto"
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                />
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Mensaje
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={6}
                    required
                  ></textarea>
                </div>
                
                <div>
                  <Button type="submit" variant="secondary">
                    Enviar mensaje
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 