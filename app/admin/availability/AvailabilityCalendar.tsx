'use client';

import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos por defecto
import { BookedDate } from './page'; // Importar el tipo desde el server component
import { format, parseISO } from 'date-fns';

interface AvailabilityCalendarProps {
  bookedDates: BookedDate[];
}

// Tipos para react-calendar
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  const [value, onChange] = useState<Value>(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState<BookedDate | null>(null);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = format(date, 'yyyy-MM-dd');
      const dayHasBooking = bookedDates.find(bd => bd.date === dateString);
      if (dayHasBooking) {
        // Contar cuántas confirmadas vs pendientes
        const confirmedCount = dayHasBooking.spaces.filter(s => s.status === 'confirmed').length;
        const pendingCount = dayHasBooking.spaces.filter(s => s.status === 'pending').length;

        if (confirmedCount > 0 && pendingCount === 0) return 'bg-red-300 text-red-900 booked-day all-confirmed';
        if (pendingCount > 0 && confirmedCount === 0) return 'bg-yellow-300 text-yellow-900 booked-day all-pending';
        if (pendingCount > 0 && confirmedCount > 0) return 'bg-orange-300 text-orange-900 booked-day mixed-status';
        return 'bg-gray-300 text-gray-700 booked-day'; // Otros estados (e.g. completed, cancelled)
      }
    }
    return null;
  };

  const handleDateClick = (clickedDate: Date) => {
    const dateString = format(clickedDate, 'yyyy-MM-dd');
    const info = bookedDates.find(bd => bd.date === dateString) || null;
    setSelectedDateInfo(info);
    onChange(clickedDate);
  };
  
  const bookedDatesSet = useMemo(() => {
    return new Set(bookedDates.map(bd => bd.date));
  }, [bookedDates]);

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    // Ejemplo: deshabilitar días que están completamente ocupados por reservaciones confirmadas
    // if (view === 'month') {
    //   const dateString = format(date, 'yyyy-MM-dd');
    //   const dayInfo = bookedDates.find(bd => bd.date === dateString);
    //   if (dayInfo && dayInfo.spaces.every(s => s.status === 'confirmed')) {
    //     // Aquí necesitaríamos saber cuántos espacios hay en total para determinar si está "completamente" ocupado.
    //     // Por ahora, no deshabilitaremos, solo colorearemos.
    //   }
    // }
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Calendar
          onChange={handleDateClick} // Usar nuestro manejador para actualizar la info seleccionada
          value={value}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          className="border rounded-md shadow-sm w-full"
          locale="es-ES" // Opcional: para localización si date-fns la soporta bien aquí
        />
      </div>
      <div className="md:w-1/2 p-4 bg-gray-50 rounded-md min-h-[200px]">
        <h3 className="text-lg font-semibold mb-3">
          Información para {value instanceof Date ? format(value, 'dd/MM/yyyy') : 'Fecha Seleccionada'}
        </h3>
        {selectedDateInfo && selectedDateInfo.spaces.length > 0 ? (
          <ul className="space-y-2">
            {selectedDateInfo.spaces.map(space => (
              <li key={space.id} 
                  className={`p-2 rounded-md text-sm 
                  ${space.status === 'confirmed' ? 'bg-red-100 text-red-800' : 
                    space.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                <strong>{space.name}</strong> - <span className="capitalize">{space.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {value instanceof Date && bookedDatesSet.has(format(value, 'yyyy-MM-dd')) 
              ? 'Cargando detalles o sin información específica para los espacios...' 
              : 'No hay reservaciones para esta fecha o fecha no seleccionada.'
            }
          </p>
        )}
      </div>
       {/* CSS en línea para los estilos de los días del calendario, ya que Calendar.css podría no ser suficiente o ser sobreescrito */}
      <style jsx global>{`
        .booked-day {
          position: relative;
        }
        .all-confirmed abbr,
        .all-pending abbr,
        .mixed-status abbr {
          text-decoration: none; /* Evitar subrayado que react-calendar a veces pone */
        }
        /* Podrías añadir más estilos aquí o referenciar clases de Tailwind en tileClassName */
      `}</style>
    </div>
  );
} 