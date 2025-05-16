import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteServiceButton from './DeleteServiceButton'; 

// Definición del tipo para un Servicio
interface Service {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  created_at: string;
  updated_at: string;
  // Campos de tu tabla services original: package_id, is_active. Los omitimos para el MVP según el prompt.
}

async function getServices(supabase: any): Promise<Service[]> {
  const { data, error } = await supabase.from('services').select('id, name, description, price, created_at, updated_at').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data || [];
}

export default async function ServicesPage() {
  const supabase = createClient(); 
  const services = await getServices(supabase);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Gestión de Servicios</h1>
        <Link href="/admin/services/new" legacyBehavior>
          <a className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Añadir Nuevo Servicio
          </a>
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500">No hay servicios registrados. ¡Comienza añadiendo uno!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    {service.description && <div className="text-xs text-gray-500">{service.description}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof service.price === 'number' ? `$${service.price.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/services/edit/${service.id}`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</a>
                    </Link>
                    <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
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