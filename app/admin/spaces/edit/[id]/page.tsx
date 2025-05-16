import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import SpaceEditForm from './SpaceEditForm'; // Client component para el formulario

// Definición del tipo para un Espacio, si no la tienes en un archivo global
interface Space {
  id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  rental_fee?: number | null;
  image_url?: string | null;
  // created_at y updated_at no son necesarios para el formulario de edición directamente
}

async function getSpaceById(id: string): Promise<Space | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('spaces')
    .select('id, name, description, capacity, rental_fee, image_url')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching space by id:', error);
    // Podrías manejar diferentes tipos de errores aquí, por ejemplo, si no se encuentra vs error de DB
    return null;
  }
  return data;
}

interface EditSpacePageProps {
  params: {
    id: string;
  };
}

export default async function EditSpacePage({ params }: EditSpacePageProps) {
  const { id } = params;
  const space = await getSpaceById(id);

  if (!space) {
    notFound(); // Muestra una página 404 si el espacio no se encuentra
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Editar Espacio</h1>
      <SpaceEditForm space={space} />
    </div>
  );
} 