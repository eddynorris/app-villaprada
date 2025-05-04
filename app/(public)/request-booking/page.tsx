"use client";

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RequestBookingPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-burgundy-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Solicitar Reserva</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Completa el formulario a continuación para solicitar la reserva para tu evento. Nos pondremos en contacto contigo en breve para confirmar los detalles.
          </p>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <form className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fecha del evento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="date"
                  placeholder="Selecciona una fecha"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Tipo de evento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent">
                  <option value="">Selecciona un tipo de evento</option>
                  <option value="boda">Boda</option>
                  <option value="corporativo">Evento corporativo</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="graduacion">Graduación</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Espacio deseado
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent">
                  <option value="">Selecciona un espacio</option>
                  <option value="salon-principal">Salón Principal</option>
                  <option value="terraza-jardin">Terraza Jardín</option>
                  <option value="salon-intimo">Salón Íntimo</option>
                </select>
              </div>
              
              <div>
                <Input
                  label="Número de invitados"
                  type="number"
                  placeholder="50"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-1">
                Detalles adicionales
              </label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent min-h-32" 
                placeholder="Cuéntanos más sobre tu evento, requerimientos especiales, etc."
                rows={5}
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">Incluye cualquier información adicional que consideres relevante.</p>
            </div>
            
            <div className="mt-8">
              <Button type="submit" variant="secondary" size="lg" className="w-full md:w-auto">
                Enviar solicitud
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Al enviar este formulario, aceptas nuestra política de privacidad y términos de servicio.
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
} 