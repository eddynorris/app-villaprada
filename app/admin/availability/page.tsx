import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AvailabilityCalendar from './AvailabilityCalendar'; // Client component para el calendario
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export interface BookedDate {
  date: string; // YYYY-MM-DD
  spaces: Array<{ id: number; name: string; status: string }>;
}

async function getBookedDates(): Promise<BookedDate[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('reservations')
    .select('
      event_date,
      status,
      spaces (id, name)
    ')
    // Solo considerar reservaciones que no estén canceladas o completadas para la disponibilidad futura
    // .in('status', ['pending', 'confirmed'])
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }

  if (!data) return [];

  // Agrupar por fecha y listar espacios/estado
  const bookedDatesMap = new Map<string, BookedDate>();

  data.forEach((reservation: any) => {
    if (!reservation.event_date || !reservation.spaces) return; // Skip si falta data esencial

    const dateStr = reservation.event_date; // YYYY-MM-DD
    const spaceInfo = {
      id: reservation.spaces.id,
      name: reservation.spaces.name,
      status: reservation.status
    };

    if (bookedDatesMap.has(dateStr)) {
      bookedDatesMap.get(dateStr)!.spaces.push(spaceInfo);
    } else {
      bookedDatesMap.set(dateStr, {
        date: dateStr,
        spaces: [spaceInfo]
      });
    }
  });

  return Array.from(bookedDatesMap.values());
}

export default async function AvailabilityPage() {
  const bookedDates = await getBookedDates();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendario de Disponibilidad</h1>
        <Link href="/admin" className="text-blue-500 hover:text-blue-700">
          &larr; Volver al Dashboard
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <AvailabilityCalendar bookedDates={bookedDates} />
      </div>
    </div>
  );
} 