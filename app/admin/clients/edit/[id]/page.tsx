import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ClientEditForm from './ClientEditForm'; // Client component para el formulario

// Definición del tipo para un Cliente
interface Client {
  id: string;
  name: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
}

async function getClientById(id: string): Promise<Client | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, contact_name, contact_email, contact_phone, address')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching client by id:', error);
    return null;
  }
  return data;
}

interface EditClientPageProps {
  params: {
    id: string;
  };
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = params;
  const client = await getClientById(id);

  if (!client) {
    notFound(); 
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Editar Cliente</h1>
      <ClientEditForm client={client} />
    </div>
  );
} 