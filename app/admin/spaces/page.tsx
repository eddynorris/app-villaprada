import { createClient } from '@/lib/supabase/server'; // O la ruta correcta a tu cliente de servidor
import Link from 'next/link';
import DeleteSpaceButton from './DeleteSpaceButton'; // Importar el nuevo componente

// Definición del tipo para un Espacio, basado en tu database.sql
interface Space {
  id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  rental_fee?: number | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

async function getSpaces(supabase: any): Promise<Space[]> {
  const { data, error } = await supabase.from('spaces').select('*').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching spaces:', error);
    // En una aplicación real, podrías lanzar el error o devolver un estado de error
    return [];
  }
  return data || [];
}

export default async function SpacesPage() {
  // Nota: La creación del cliente Supabase aquí dependerá de cómo lo hayas configurado
  // para Server Components. Asumiendo que `createClient` de `lib/supabase/server.ts` funciona.
  const supabase = createClient(); 
  const spaces = await getSpaces(supabase);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Gestión de Espacios</h1>
        <Link href="/admin/spaces/new" legacyBehavior>
          <a className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Añadir Nuevo Espacio
          </a>
        </Link>
      </div>

      {spaces.length === 0 ? (
        <p className="text-gray-500">No hay espacios registrados. ¡Comienza añadiendo uno!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Alquiler
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spaces.map((space) => (
                <tr key={space.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{space.name}</div>
                    {space.description && <div className="text-xs text-gray-500">{space.description}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {space.capacity !== null ? space.capacity : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof space.rental_fee === 'number' ? `$${space.rental_fee.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/spaces/edit/${space.id}`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</a>
                    </Link>
                    <DeleteSpaceButton spaceId={space.id} spaceName={space.name} />
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

// Necesitaremos una página para `/admin/spaces/new` y para `/admin/spaces/edit/[id]` 