import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { format } from 'date-fns'; // Para formatear fechas y horas
import DeleteReservationButton from './DeleteReservationButton'; // Importar el botón

export const dynamic = 'force-dynamic'; // Asegurar que la página sea dinámica

interface Reservation {
  id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  client_name: string; // Nombre del cliente
  space_name: string;  // Nombre del espacio
  notes?: string;
}

export default async function ReservationsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: reservationsData, error } = await supabase
    .from('reservations')
    .select(`
      id,
      event_date,
      start_time,
      end_time,
      status,
      total_price,
      notes,
      clients ( name ),
      spaces ( name )
    `)
    .order('event_date', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    // Considerar mostrar un mensaje de error más amigable al usuario
  }

  const reservations: Reservation[] = reservationsData?.map((r: any) => ({
    id: r.id,
    event_date: r.event_date,
    start_time: r.start_time,
    end_time: r.end_time,
    status: r.status,
    total_price: r.total_price,
    client_name: r.clients?.name || 'N/A',
    space_name: r.spaces?.name || 'N/A',
    notes: r.notes,
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservaciones</h1>
        <Link href="/admin/reservations/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Crear Nueva Reservación
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> No se pudieron cargar las reservaciones. {error.message}</span>
        </div>
      )}

      {reservations.length === 0 && !error && (
        <p className="text-gray-600">No hay reservaciones registradas.</p>
      )}

      {reservations.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Evento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.space_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(reservation.event_date + 'T00:00:00'), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reservation.start_time.substring(0,5)} - {reservation.end_time.substring(0,5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800' // completed or other
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    ${reservation.total_price.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/reservations/edit/${reservation.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Editar
                    </Link>
                    <DeleteReservationButton reservationId={reservation.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 