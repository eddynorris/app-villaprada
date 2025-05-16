import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ServiceEditForm from './ServiceEditForm'; // Client component para el formulario

// Definición del tipo para un Servicio
interface Service {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
}

async function getServiceById(id: string): Promise<Service | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, price')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }
  return data;
}

interface EditServicePageProps {
  params: {
    id: string;
  };
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = params;
  const service = await getServiceById(id);

  if (!service) {
    notFound(); 
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Editar Servicio</h1>
      <ServiceEditForm service={service} />
    </div>
  );
} 