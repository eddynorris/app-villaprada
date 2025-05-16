import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
// import DeleteClientButton from './DeleteClientButton'; // Lo crearemos después

// Definición del tipo para un Cliente
interface Client {
  id: string;
  name: string; // Nombre de la empresa o persona principal
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

async function getClients(supabase: any): Promise<Client[]> {
  // Seleccionamos los campos relevantes para el MVP y la tabla
  const { data, error } = await supabase.from('clients').select('id, name, contact_name, contact_email, contact_phone, address, created_at, updated_at').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data || [];
}

export default async function ClientsPage() {
  const supabase = createClient(); 
  const clients = await getClients(supabase);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Gestión de Clientes</h1>
        <Link href="/admin/clients/new" legacyBehavior>
          <a className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Añadir Nuevo Cliente
          </a>
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500">No hay clientes registrados. ¡Comienza añadiendo uno!</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email de Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono de Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    {client.contact_name && <div className="text-xs text-gray-500">Persona de contacto: {client.contact_name}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.contact_email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.contact_phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/clients/edit/${client.id}`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</a>
                    </Link>
                    {/* <DeleteClientButton clientId={client.id} clientName={client.name} /> */}
                    <button className="text-red-600 hover:text-red-900" disabled>Eliminar</button> {/* Placeholder */}
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