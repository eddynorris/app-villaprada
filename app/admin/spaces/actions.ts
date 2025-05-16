'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema de validación con Zod para los datos del espacio (usado por ambas acciones)
const SpaceSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  description: z.string().optional().nullable(),
  capacity: z.coerce.number().int().min(0, { message: 'La capacidad no puede ser negativa.' }).optional().nullable(),
  rental_fee: z.coerce.number().min(0, { message: 'El precio de alquiler no puede ser negativo.' }).optional().nullable(),
  image_url: z.string().url({ message: 'URL de imagen inválida.' }).optional().nullable().or(z.literal('')),
});

interface ActionResult {
  error?: string;
}

// --- CREATE ACTION ---
export async function createSpaceAction(formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    capacity: formData.get('capacity') || null,
    rental_fee: formData.get('rental_fee') || null,
    image_url: formData.get('image_url') || null,
  };
  const validation = SpaceSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  const { name, description, capacity, rental_fee, image_url } = validation.data;

  const { error: dbError } = await supabase.from('spaces').insert([
    {
      name,
      description: description || null,
      capacity: capacity !== null ? Number(capacity) : null,
      rental_fee: rental_fee !== null ? Number(rental_fee) : null,
      image_url: image_url || null,
    },
  ]);

  if (dbError) {
    console.error('Error creating space:', dbError);
    return { error: `Error de base de datos: ${dbError.message}` };
  }
  revalidatePath('/admin/spaces');
}

// --- UPDATE ACTION ---
export async function updateSpaceAction(id: string, formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    capacity: formData.get('capacity') || null,
    rental_fee: formData.get('rental_fee') || null,
    image_url: formData.get('image_url') || null,
  };
  const validation = SpaceSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  const { name, description, capacity, rental_fee, image_url } = validation.data;

  const { error: dbError } = await supabase
    .from('spaces')
    .update({
      name,
      description: description || null,
      capacity: capacity !== null ? Number(capacity) : null,
      rental_fee: rental_fee !== null ? Number(rental_fee) : null,
      image_url: image_url || null,
      updated_at: new Date().toISOString(), // Actualizar manualmente updated_at
    })
    .eq('id', id);

  if (dbError) {
    console.error('Error updating space:', dbError);
    return { error: `Error de base de datos al actualizar: ${dbError.message}` };
  }
  revalidatePath('/admin/spaces'); // Revalidar la lista
  revalidatePath(`/admin/spaces/edit/${id}`); // Revalidar la página de edición actual
}

// --- DELETE ACTION ---
export async function deleteSpaceAction(id: string): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  if (!id) {
    return { error: 'ID del espacio no proporcionado.' };
  }

  const { error: dbError } = await supabase
    .from('spaces')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting space:', dbError);
    return { error: `Error de base de datos al eliminar: ${dbError.message}` };
  }

  revalidatePath('/admin/spaces'); // Revalidar la lista de espacios
  // No es necesario revalidar la página de edición ya que el espacio ya no existirá.
} 