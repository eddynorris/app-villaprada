'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ReservationBaseSchema = z.object({
  client_id: z.coerce.number().int().positive('El cliente es obligatorio.'),
  space_id: z.coerce.number().int().positive('El espacio es obligatorio.'),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha del evento inválida.'), // YYYY-MM-DD
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de inicio inválida.'), // HH:MM
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora de fin inválida.'), // HH:MM
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  total_price: z.coerce.number().nonnegative('El precio total no puede ser negativo.'),
  notes: z.string().optional(),
});

const ReservationSchema = ReservationBaseSchema.refine(data => {
    return data.end_time > data.start_time;
}, {
    message: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["end_time"], // Campo que causa el error
});

export type ReservationFormState = {
  message: string;
  errors?: {
    client_id?: string[];
    space_id?: string[];
    event_date?: string[];
    start_time?: string[];
    end_time?: string[];
    status?: string[];
    total_price?: string[];
    notes?: string[];
    _form?: string[]; // Para errores generales del formulario
  };
  fieldValues?: Partial<z.infer<typeof ReservationBaseSchema>>;
};

export async function createReservationAction(prevState: ReservationFormState, formData: FormData): Promise<ReservationFormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = ReservationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Error de validación.',
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: rawData as Partial<z.infer<typeof ReservationBaseSchema>>
    };
  }

  const { data: reservationData, error } = await supabase
    .from('reservations')
    .insert({
      ...validatedFields.data,
      updated_at: new Date().toISOString(), // Establecer updated_at manualmente
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating reservation:', error);
    return {
      message: `Error al crear la reservación: ${error.message}`,
      errors: { _form: [error.message] },
      fieldValues: validatedFields.data
    };
  }

  revalidatePath('/admin/reservations');
  // No redirigir inmediatamente para poder mostrar un mensaje de éxito o manejarlo en el cliente
  // redirect('/admin/reservations'); // Opcional: redirigir tras éxito
  return { message: 'Reservación creada con éxito.', fieldValues: {} };
}

// Añadir ID al esquema para la actualización
const ReservationUpdateSchema = ReservationBaseSchema.extend({
  id: z.coerce.number().int().positive('ID de reservación es obligatorio para actualizar.'),
}).refine(data => {
    return data.end_time > data.start_time;
}, {
    message: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["end_time"],
});

export async function updateReservationAction(prevState: ReservationFormState, formData: FormData): Promise<ReservationFormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = ReservationUpdateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log('Update validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Error de validación al actualizar.',
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: rawData as Partial<z.infer<typeof ReservationUpdateSchema>>
    };
  }

  const { id, ...dataToUpdate } = validatedFields.data;

  const { error } = await supabase
    .from('reservations')
    .update({
      ...dataToUpdate,
      updated_at: new Date().toISOString(), // Asegurar que updated_at se actualice
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating reservation:', error);
    return {
      message: `Error al actualizar la reservación: ${error.message}`,
      errors: { _form: [error.message] },
      fieldValues: validatedFields.data
    };
  }

  revalidatePath('/admin/reservations');
  revalidatePath(`/admin/reservations/edit/${id}`);
  
  return { message: 'Reservación actualizada con éxito.', fieldValues: validatedFields.data };
}

export async function deleteReservationAction(id: number): Promise<{ message: string; error?: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Antes de eliminar, podríamos verificar si hay pagos asociados y decidir cómo manejarlos
  // Por ahora, eliminaremos directamente. La base de datos debería manejar las restricciones FK (ON DELETE CASCADE para reservation_services)

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reservation:', error);
    return { message: 'Error al eliminar la reservación.', error: error.message };
  }

  revalidatePath('/admin/reservations');
  return { message: 'Reservación eliminada con éxito.' };
}

// -------- PAYMENT ACTIONS --------

export const paymentMethods = ['cash', 'yape', 'plin', 'transfer', 'card', 'other'] as const;
const PaymentMethodEnum = z.enum(paymentMethods);

const PaymentSchema = z.object({
  reservation_id: z.coerce.number().int().positive(),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de pago inválida.'),
  amount: z.coerce.number().positive('El monto debe ser positivo.'),
  method: PaymentMethodEnum,
  reference_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PaymentFormState = {
  message: string;
  errors?: {
    reservation_id?: string[];
    payment_date?: string[];
    amount?: string[];
    method?: string[];
    reference_number?: string[];
    notes?: string[];
    _form?: string[];
  };
  fieldValues?: Partial<z.infer<typeof PaymentSchema>>;
};

export async function createPaymentAction(reservationId: number, prevState: PaymentFormState, formData: FormData): Promise<PaymentFormState> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawData = {
    ...Object.fromEntries(formData.entries()),
    reservation_id: reservationId, // Añadir reservation_id programáticamente
  };

  const validatedFields = PaymentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Error de validación al crear el pago.',
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: rawData as Partial<z.infer<typeof PaymentSchema>>
    };
  }

  const { error } = await supabase.from('payments').insert({
    ...validatedFields.data,
    // created_at y updated_at son manejados por la DB
  });

  if (error) {
    console.error('Error creating payment:', error);
    return {
      message: `Error al registrar el pago: ${error.message}`,
      errors: { _form: [error.message] },
      fieldValues: validatedFields.data
    };
  }

  revalidatePath(`/admin/reservations/edit/${reservationId}`);
  return { message: 'Pago registrado con éxito.', fieldValues: {} };
}

export async function deletePaymentAction(paymentId: string, reservationId: number): Promise<{ message: string; error?: string }> {
  if (!paymentId) {
    return { message: 'Error: ID de pago no proporcionado.', error: 'ID de pago no proporcionado' };
  }
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId);

  if (error) {
    console.error('Error deleting payment:', error);
    return { message: 'Error al eliminar el pago.', error: error.message };
  }

  revalidatePath(`/admin/reservations/edit/${reservationId}`);
  return { message: 'Pago eliminado con éxito.' };
} 