'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquema de validación con Zod para los datos del servicio
const ServiceSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, { message: 'El precio no puede ser negativo.' }).optional().nullable(),
});

interface ActionResult {
  error?: string;
}

// --- CREATE SERVICE ACTION ---
export async function createServiceAction(formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price') || null,
  };

  const validation = ServiceSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { name, description, price } = validation.data;

  const { error: dbError } = await supabase.from('services').insert([
    {
      name,
      description: description || null,
      price: price !== null ? Number(price) : null,
      // package_id e is_active no se manejan en este MVP simplificado
    },
  ]);

  if (dbError) {
    console.error('Error creating service:', dbError);
    return { error: `Error de base de datos: ${dbError.message}` };
  }

  revalidatePath('/admin/services');
}

// --- UPDATE SERVICE ACTION ---
export async function updateServiceAction(id: string, formData: FormData): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price') || null,
  };

  const validation = ServiceSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { name, description, price } = validation.data;

  const { error: dbError } = await supabase
    .from('services')
    .update({
      name,
      description: description || null,
      price: price !== null ? Number(price) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (dbError) {
    console.error('Error updating service:', dbError);
    return { error: `Error de base de datos al actualizar: ${dbError.message}` };
  }

  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/edit/${id}`);
}

// --- DELETE SERVICE ACTION ---
export async function deleteServiceAction(id: string): Promise<ActionResult | void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }
  // TODO: Verificar rol de admin

  if (!id) {
    return { error: 'ID del servicio no proporcionado.' };
  }

  const { error: dbError } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error deleting service:', dbError);
    return { error: `Error de base de datos al eliminar: ${dbError.message}` };
  }

  revalidatePath('/admin/services');
} 