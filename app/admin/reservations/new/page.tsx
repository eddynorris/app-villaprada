'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { createReservationAction, ReservationFormState } from './actions';
import { createClient } from '@/lib/supabase/client'; // Usar cliente de navegador para fetches en cliente

interface Client {
  id: number;
  name: string;
}

interface Space {
  id: number;
  name: string;
}

const initialState: ReservationFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {pending ? 'Creando Reservación...' : 'Crear Reservación'}
    </button>
  );
}

export default function NewReservationPage() {
  const [state, formAction] = useFormState(createReservationAction, initialState);
  const [clients, setClients] = useState<Client[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const supabase = createClient(); // Cliente Supabase para el navegador

  useEffect(() => {
    async function fetchData() {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
      if (clientsData) setClients(clientsData);
      if (clientsError) console.error('Error fetching clients:', clientsError);

      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('id, name')
        .order('name');
      if (spacesData) setSpaces(spacesData);
      if (spacesError) console.error('Error fetching spaces:', spacesError);
    }
    fetchData();
  }, [supabase]);

  // Para resetear el formulario después de un envío exitoso
  useEffect(() => {
    if (state.message === 'Reservación creada con éxito.') {
        const form = document.getElementById('new-reservation-form') as HTMLFormElement;
        if (form) {
            form.reset();
        }
    }
  }, [state.message]);


  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crear Nueva Reservación</h1>
        <Link href="/admin/reservations" className="text-blue-500 hover:text-blue-700">
          &larr; Volver a Reservaciones
        </Link>
      </div>

      <form id="new-reservation-form" action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {state.message && !state.errors && (
          <div className={`mb-4 p-3 rounded ${state.message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {state.message}
          </div>
        )}
        {state.errors?._form && (
           <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
             <p>{state.errors._form.join(', ')}</p>
           </div>
        )}

        <div className="mb-4">
          <label htmlFor="client_id" className="block text-gray-700 text-sm font-bold mb-2">Cliente</label>
          <select 
            id="client_id" 
            name="client_id" 
            defaultValue={state.fieldValues?.client_id || ''}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.client_id ? 'border-red-500' : ''}`}
          >
            <option value="" disabled>Seleccione un cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          {state.errors?.client_id && <p className="text-red-500 text-xs italic">{state.errors.client_id.join(', ')}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="space_id" className="block text-gray-700 text-sm font-bold mb-2">Espacio</label>
          <select 
            id="space_id" 
            name="space_id" 
            defaultValue={state.fieldValues?.space_id || ''}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.space_id ? 'border-red-500' : ''}`}
          >
            <option value="" disabled>Seleccione un espacio</option>
            {spaces.map(space => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
          {state.errors?.space_id && <p className="text-red-500 text-xs italic">{state.errors.space_id.join(', ')}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="event_date" className="block text-gray-700 text-sm font-bold mb-2">Fecha del Evento</label>
          <input 
            type="date" 
            id="event_date" 
            name="event_date" 
            defaultValue={state.fieldValues?.event_date || ''}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.event_date ? 'border-red-500' : ''}`}
          />
          {state.errors?.event_date && <p className="text-red-500 text-xs italic">{state.errors.event_date.join(', ')}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="start_time" className="block text-gray-700 text-sm font-bold mb-2">Hora de Inicio</label>
            <input 
              type="time" 
              id="start_time" 
              name="start_time" 
              defaultValue={state.fieldValues?.start_time || ''}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.start_time ? 'border-red-500' : ''}`}
            />
            {state.errors?.start_time && <p className="text-red-500 text-xs italic">{state.errors.start_time.join(', ')}</p>}
          </div>
          <div>
            <label htmlFor="end_time" className="block text-gray-700 text-sm font-bold mb-2">Hora de Fin</label>
            <input 
              type="time" 
              id="end_time" 
              name="end_time" 
              defaultValue={state.fieldValues?.end_time || ''}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.end_time ? 'border-red-500' : ''}`}
            />
            {state.errors?.end_time && <p className="text-red-500 text-xs italic">{state.errors.end_time.join(', ')}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
          <select 
            id="status" 
            name="status" 
            defaultValue={state.fieldValues?.status || 'pending'}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.status ? 'border-red-500' : ''}`}
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="completed">Completada</option>
          </select>
          {state.errors?.status && <p className="text-red-500 text-xs italic">{state.errors.status.join(', ')}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="total_price" className="block text-gray-700 text-sm font-bold mb-2">Precio Total</label>
          <input 
            type="number" 
            id="total_price" 
            name="total_price" 
            step="0.01"
            defaultValue={state.fieldValues?.total_price || '0'}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.total_price ? 'border-red-500' : ''}`}
          />
          {state.errors?.total_price && <p className="text-red-500 text-xs italic">{state.errors.total_price.join(', ')}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notas (Opcional)</label>
          <textarea 
            id="notes" 
            name="notes" 
            rows={3}
            defaultValue={state.fieldValues?.notes || ''}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${state.errors?.notes ? 'border-red-500' : ''}`}
          />
          {state.errors?.notes && <p className="text-red-500 text-xs italic">{state.errors.notes.join(', ')}</p>}
        </div>
        
        <div className="flex items-center justify-between">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
} 