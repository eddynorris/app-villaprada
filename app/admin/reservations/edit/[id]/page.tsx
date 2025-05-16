import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReservationEditForm from './ReservationEditForm'; // El Client Component para el formulario

export const dynamic = 'force-dynamic';

interface EditReservationPageProps {
  params: {
    id: string;
  };
}

async function getReservation(id: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching reservation for edit:', error);
    return null;
  }
  return data;
}

async function getClients() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('clients')
    .select('id, name')
    .order('name');
  if (error) {
    console.error('Error fetching clients for edit form:', error);
    return [];
  }
  return data || [];
}

async function getSpaces() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('spaces')
    .select('id, name')
    .order('name');
  if (error) {
    console.error('Error fetching spaces for edit form:', error);
    return [];
  }
  return data || [];
}

async function getPaymentsForReservation(reservationId: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('payments')
    .select('id, payment_date, amount, method, reference_number, notes')
    .eq('reservation_id', reservationId)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching payments for reservation:', error);
    return [];
  }
  // Asegurarse que amount es un número
  return data?.map(p => ({...p, amount: Number(p.amount)})) || [];
}

export default async function EditReservationPage({ params }: EditReservationPageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const [reservation, clients, spaces, payments] = await Promise.all([
    getReservation(id),
    getClients(),
    getSpaces(),
    getPaymentsForReservation(id), // Obtener pagos
  ]);

  if (!reservation) {
    notFound();
  }

  // Convertir tipos de fecha y hora a string si es necesario para el formulario
  // Supabase devuelve fechas como string YYYY-MM-DD y horas como string HH:MM:SS
  // El formulario espera YYYY-MM-DD para date y HH:MM para time.
  const formattedReservation = {
    ...reservation,
    event_date: reservation.event_date, // Ya está en formato YYYY-MM-DD
    start_time: reservation.start_time.substring(0, 5), // HH:MM
    end_time: reservation.end_time.substring(0, 5),     // HH:MM
  };

  return (
    <ReservationEditForm 
        reservation={formattedReservation} 
        clients={clients} 
        spaces={spaces} 
        payments={payments} // Pasar pagos al formulario
    />
  );
} 