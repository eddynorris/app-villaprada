'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  updateReservationAction,
  ReservationFormState,
  createPaymentAction, // Importar acción de crear pago
  PaymentFormState,    // Importar estado de formulario de pago
  paymentMethods       // Importar métodos de pago
} from '../../actions'; // Ajustar ruta a actions
import { useEffect, useState } from 'react';
import DeletePaymentButton from './DeletePaymentButton'; // Importar botón de eliminar pago
import { format } from 'date-fns';

// Tipos de datos que el formulario recibe como props
interface Reservation {
  id: number;
  client_id: number;
  space_id: number;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  notes?: string | null;
}

interface Client {
  id: number;
  name: string;
}

interface Space {
  id: number;
  name: string;
}

// Tipo para un pago individual (como se recibe del servidor)
interface Payment {
  id: string; // UUID en la DB, pero puede ser string aquí
  payment_date: string; // YYYY-MM-DD
  amount: number;
  method: typeof paymentMethods[number];
  reference_number?: string | null;
  notes?: string | null;
}

interface ReservationEditFormProps {
  reservation: Reservation;
  clients: Client[];
  spaces: Space[];
  payments: Payment[]; // Añadir payments a las props
}

const initialReservationState: ReservationFormState = {
  message: '',
};

const initialPaymentState: PaymentFormState = {
  message: '',
};

function SubmitReservationButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-green-500 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {pending ? 'Actualizando Reservación...' : 'Actualizar Reservación'}
    </button>
  );
}

function SubmitPaymentButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-teal-500 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
    >
      {pending ? 'Registrando...' : 'Registrar Pago'}
    </button>
  );
}

export default function ReservationEditForm({ reservation, clients, spaces, payments }: ReservationEditFormProps) {
  const updateReservationActionWithId = updateReservationAction.bind(null);
  const [reservationFormState, reservationFormAction] = useFormState(
    updateReservationActionWithId,
    {
      ...initialReservationState,
      fieldValues: {
        ...reservation,
        notes: reservation.notes || '' 
      }
    }
  );

  const createPaymentActionForThisReservation = createPaymentAction.bind(null, reservation.id);
  const [paymentFormState, paymentFormAction] = useFormState(createPaymentActionForThisReservation, initialPaymentState);

  const [showPaymentMessage, setShowPaymentMessage] = useState(false);

  useEffect(() => {
    if (paymentFormState.message) {
      setShowPaymentMessage(true);
      const timer = setTimeout(() => setShowPaymentMessage(false), 3000);
      if (paymentFormState.message === 'Pago registrado con éxito.') {
        // Resetear el formulario de pago si es exitoso
        const form = document.getElementById('new-payment-form') as HTMLFormElement;
        if (form) form.reset();
      }
      return () => clearTimeout(timer);
    }
  }, [paymentFormState]);
  
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const balanceDue = reservation.total_price - totalPaid;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Formulario de Edición de Reservación */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Reservación (ID: {reservation.id})</h1>
          <Link href="/admin/reservations" className="text-blue-500 hover:text-blue-700">
            &larr; Volver a Reservaciones
          </Link>
        </div>
        <form action={reservationFormAction} >
          <input type="hidden" name="id" defaultValue={reservation.id} />
          {reservationFormState.message && (
            <div className={`mb-4 p-3 rounded ${reservationFormState.message.toLowerCase().includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {reservationFormState.message}
            </div>
          )}
          {reservationFormState.errors?._form && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
              <p>{reservationFormState.errors._form.join(', ')}</p>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="client_id" className="block text-gray-700 text-sm font-bold mb-2">Cliente</label>
            <select id="client_id" name="client_id" defaultValue={reservationFormState.fieldValues?.client_id ?? reservation.client_id} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.client_id ? 'border-red-500' : ''}`}>
              {clients.map(client => (<option key={client.id} value={client.id}>{client.name}</option>))}
            </select>
            {reservationFormState.errors?.client_id && <p className="text-red-500 text-xs italic">{reservationFormState.errors.client_id.join(', ')}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="space_id" className="block text-gray-700 text-sm font-bold mb-2">Espacio</label>
            <select id="space_id" name="space_id" defaultValue={reservationFormState.fieldValues?.space_id ?? reservation.space_id} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.space_id ? 'border-red-500' : ''}`}>
              {spaces.map(space => (<option key={space.id} value={space.id}>{space.name}</option>))}
            </select>
            {reservationFormState.errors?.space_id && <p className="text-red-500 text-xs italic">{reservationFormState.errors.space_id.join(', ')}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="event_date" className="block text-gray-700 text-sm font-bold mb-2">Fecha del Evento</label>
            <input type="date" id="event_date" name="event_date" defaultValue={reservationFormState.fieldValues?.event_date ?? reservation.event_date} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.event_date ? 'border-red-500' : ''}`}/>
            {reservationFormState.errors?.event_date && <p className="text-red-500 text-xs italic">{reservationFormState.errors.event_date.join(', ')}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="start_time" className="block text-gray-700 text-sm font-bold mb-2">Hora de Inicio</label>
              <input type="time" id="start_time" name="start_time" defaultValue={reservationFormState.fieldValues?.start_time ?? reservation.start_time} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.start_time ? 'border-red-500' : ''}`}/>
              {reservationFormState.errors?.start_time && <p className="text-red-500 text-xs italic">{reservationFormState.errors.start_time.join(', ')}</p>}
            </div>
            <div>
              <label htmlFor="end_time" className="block text-gray-700 text-sm font-bold mb-2">Hora de Fin</label>
              <input type="time" id="end_time" name="end_time" defaultValue={reservationFormState.fieldValues?.end_time ?? reservation.end_time} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.end_time ? 'border-red-500' : ''}`}/>
              {reservationFormState.errors?.end_time && <p className="text-red-500 text-xs italic">{reservationFormState.errors.end_time.join(', ')}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
            <select id="status" name="status" defaultValue={reservationFormState.fieldValues?.status ?? reservation.status} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.status ? 'border-red-500' : ''}`}>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
            {reservationFormState.errors?.status && <p className="text-red-500 text-xs italic">{reservationFormState.errors.status.join(', ')}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="total_price" className="block text-gray-700 text-sm font-bold mb-2">Precio Total Acordado</label>
            <input type="number" id="total_price" name="total_price" step="0.01" defaultValue={(reservationFormState.fieldValues?.total_price ?? reservation.total_price).toString()} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.total_price ? 'border-red-500' : ''}`}/>
            {reservationFormState.errors?.total_price && <p className="text-red-500 text-xs italic">{reservationFormState.errors.total_price.join(', ')}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notas de la Reservación</label>
            <textarea id="notes" name="notes" rows={3} defaultValue={reservationFormState.fieldValues?.notes ?? reservation.notes ?? ''} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reservationFormState.errors?.notes ? 'border-red-500' : ''}`}/>
            {reservationFormState.errors?.notes && <p className="text-red-500 text-xs italic">{reservationFormState.errors.notes.join(', ')}</p>}
          </div>
          <div className="flex items-center justify-between">
            <SubmitReservationButton />
          </div>
        </form>
      </div>

      {/* Sección de Pagos */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Gestión de Pagos</h2>
        
        {/* Resumen de Pagos */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-lg font-medium">
                <span>Total Acordado:</span>
                <span>${reservation.total_price.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-lg font-medium text-green-600">
                <span>Total Pagado:</span>
                <span>${totalPaid.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <hr className="my-2"/>
            <div className={`flex justify-between text-lg font-bold ${balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>Saldo Pendiente:</span>
                <span>${balanceDue.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>

        {/* Formulario para Añadir Nuevo Pago */}
        <form id="new-payment-form" action={paymentFormAction} className="mb-6 border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Registrar Nuevo Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">Fecha del Pago</label>
              <input type="date" id="payment_date" name="payment_date" defaultValue={new Date().toISOString().split('T')[0]} required className={`mt-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${paymentFormState.errors?.payment_date ? 'border-red-500' : ''}`} />
              {paymentFormState.errors?.payment_date && <p className="text-red-500 text-xs italic">{paymentFormState.errors.payment_date.join(', ')}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
              <input type="number" id="amount" name="amount" step="0.01" required className={`mt-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${paymentFormState.errors?.amount ? 'border-red-500' : ''}`} />
              {paymentFormState.errors?.amount && <p className="text-red-500 text-xs italic">{paymentFormState.errors.amount.join(', ')}</p>}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <select id="method" name="method" required className={`mt-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${paymentFormState.errors?.method ? 'border-red-500' : ''}`}>
              {paymentMethods.map(method => (<option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>))}
            </select>
            {paymentFormState.errors?.method && <p className="text-red-500 text-xs italic">{paymentFormState.errors.method.join(', ')}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">Referencia (Opcional)</label>
            <input type="text" id="reference_number" name="reference_number" className={`mt-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${paymentFormState.errors?.reference_number ? 'border-red-500' : ''}`} />
            {paymentFormState.errors?.reference_number && <p className="text-red-500 text-xs italic">{paymentFormState.errors.reference_number.join(', ')}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="payment_notes" className="block text-sm font-medium text-gray-700">Notas del Pago (Opcional)</label>
            <textarea id="payment_notes" name="notes" rows={2} className={`mt-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${paymentFormState.errors?.notes ? 'border-red-500' : ''}`} />
            {paymentFormState.errors?.notes && <p className="text-red-500 text-xs italic">{paymentFormState.errors.notes.join(', ')}</p>}
          </div>
          <div className="flex justify-end">
            <SubmitPaymentButton />
          </div>
          {showPaymentMessage && paymentFormState.message && (
            <div className={`mt-3 p-2 rounded text-sm ${paymentFormState.message.toLowerCase().includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {paymentFormState.message}
            </div>
          )}
        </form>

        {/* Lista de Pagos Existentes */}
        <h3 className="text-lg font-medium mb-3 mt-6">Historial de Pagos</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">No hay pagos registrados para esta reservación.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{format(new Date(payment.payment_date + 'T00:00:00'), 'dd/MM/yyyy')}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">${Number(payment.amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{payment.reference_number || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{payment.notes || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <DeletePaymentButton paymentId={payment.id} reservationId={reservation.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 