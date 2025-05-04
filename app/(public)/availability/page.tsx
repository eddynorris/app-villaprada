"use client";

import { useState } from 'react';
import AvailabilityCalendar from '@/components/public/AvailabilityCalendar';
import Card, { CardContent } from '@/components/ui/Card';

// Datos mockados - en una implementación real vendrían de una API
const bookings = [
  { date: '2023-mayo-5', event: 'Boda' },
  { date: '2023-mayo-12', event: 'Corporativo' },
  { date: '2023-mayo-18', event: 'Cumpleaños' }
];

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-burgundy-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Calendario de Disponibilidad</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Consulta las fechas disponibles para tu evento y reserva con anticipación para asegurar el día perfecto.
          </p>
        </div>
      </section>
      
      {/* Calendar Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Calendar */}
            <div className="col-span-2">
              <AvailabilityCalendar 
                month="mayo"
                year={2023}
                bookings={bookings}
              />
            </div>
            
            {/* Selection Panel */}
            <div>
              <Card>
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">Selecciona una fecha</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <button className="text-burgundy-700">&#10094;</button>
                      <h3 className="text-lg font-medium">May 2023</h3>
                      <button className="text-burgundy-700">&#10095;</button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center">
                      <div className="text-xs font-medium text-gray-500">Su</div>
                      <div className="text-xs font-medium text-gray-500">Mo</div>
                      <div className="text-xs font-medium text-gray-500">Tu</div>
                      <div className="text-xs font-medium text-gray-500">We</div>
                      <div className="text-xs font-medium text-gray-500">Th</div>
                      <div className="text-xs font-medium text-gray-500">Fr</div>
                      <div className="text-xs font-medium text-gray-500">Sa</div>
                      
                      <div className="text-gray-400 text-sm p-1">27</div>
                      <div className="text-gray-400 text-sm p-1">28</div>
                      <div className="text-gray-400 text-sm p-1">29</div>
                      <div className="text-gray-400 text-sm p-1">30</div>
                      
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const isBooked = bookings.some(b => b.date === `2023-mayo-${day}`);
                        const isSelected = selectedDate === `2023-mayo-${day}`;
                        
                        return (
                          <div
                            key={day}
                            className={`
                              text-sm p-1 cursor-pointer rounded
                              ${isBooked ? 'bg-pink-100' : 'hover:bg-gray-100'}
                              ${isSelected ? 'bg-burgundy-100 border border-burgundy-500' : ''}
                            `}
                            onClick={() => setSelectedDate(`2023-mayo-${day}`)}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    <h3 className="font-bold">Información</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-pink-100 border border-pink-200 rounded"></div>
                      <span className="text-sm">Fecha no disponible</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                      <span className="text-sm">Fecha disponible</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-burgundy-100 border border-burgundy-500 rounded"></div>
                      <span className="text-sm">Fecha seleccionada</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4">
                      Para consultar disponibilidad específica de espacios y horarios, o para realizar una reserva, 
                      contacta con nuestro equipo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 