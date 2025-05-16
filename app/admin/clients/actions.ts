'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema de validación para Clientes
const ClientSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  contact_name: z.string().optional().nullable(),
  contact_email: z.string().email({ message: 'Email inválido.' }).optional().nullable().or(z.literal('')),
  contact_phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

interface ActionResult {
  error?: string;
}

// --- CREATE CLIENT ACTION ---
export async function createClientAction(formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado.' };
  }
  // TODO: Admin role check

  const rawData = {
    name: formData.get('name'),
    contact_name: formData.get('contact_name'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone'),
    address: formData.get('address'),
  };

  const validation = ClientSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { name, contact_name, contact_email, contact_phone, address } = validation.data;

  const { error: dbError } = await supabase.from('clients').insert([
    {
      name,
      contact_name: contact_name || null,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      address: address || null,
    },
  ]);

  if (dbError) {
    console.error('Error creating client:', dbError);
    return { error: `Database error: ${dbError.message}` };
  }

  revalidatePath('/admin/clients');
}

// --- UPDATE CLIENT ACTION ---
export async function updateClientAction(id: string, formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado.' };
  }
  // TODO: Admin role check

  const rawData = {
    name: formData.get('name'),
    contact_name: formData.get('contact_name'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone'),
    address: formData.get('address'),
  };

  const validation = ClientSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { name, contact_name, contact_email, contact_phone, address } = validation.data;

  const { error: dbError } = await supabase
    .from('clients')
    .update({
      name,
      contact_name: contact_name || null,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      address: address || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (dbError) {
    console.error('Error updating client:', dbError);
    return { error: `Database error: ${dbError.message}` };
  }

  revalidatePath('/admin/clients');
  revalidatePath(`/admin/clients/edit/${id}`);
}

// --- DELETE CLIENT ACTION ---
export async function deleteClientAction(id: string): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado.' };
  }
  // TODO: Admin role check

  if (!id) {
    return { error: 'ID del cliente no proporcionado.' };
  }

  // Antes de eliminar un cliente, considera la lógica de negocio:
  // ¿Qué sucede con las reservas asociadas? ¿Se deben eliminar en cascada o marcar como inactivas?
  // Por ahora, simplemente eliminaremos el cliente. Deberás ajustar esto según tus reglas.
  // Ejemplo: podrías necesitar eliminar primero las `booking_services`, luego `payments`, `expenses`, 
  // `booking_spaces`, `bookings` asociadas a este cliente si no tienes ON DELETE CASCADE configurado
  // o si prefieres manejarlo explícitamente.

  const { error: dbError } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting client:', dbError);
    // Podrías tener un error de clave foránea si hay reservas vinculadas y no hay ON DELETE CASCADE
    if (dbError.code === '23503') { // Código de error para violación de foreign key
        return { error: 'No se puede eliminar el cliente porque tiene reservas asociadas. Elimine o desvincule las reservas primero.' };
    }
    return { error: `Error de base de datos al eliminar: ${dbError.message}` };
  }

  revalidatePath('/admin/clients');
} 