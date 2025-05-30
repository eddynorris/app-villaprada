'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
import { updateClientAction } from '../../actions';

interface Client {
  id: string;
  name: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
}

interface ClientEditFormProps {
  client: Client;
}

export default function ClientEditForm({ client }: ClientEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(client.name);
  const [contactName, setContactName] = useState(client.contact_name || '');
  const [contactEmail, setContactEmail] = useState(client.contact_email || '');
  const [contactPhone, setContactPhone] = useState(client.contact_phone || '');
  const [address, setAddress] = useState(client.address || '');

  useEffect(() => {
    setName(client.name);
    setContactName(client.contact_name || '');
    setContactEmail(client.contact_email || '');
    setContactPhone(client.contact_phone || '');
    setAddress(client.address || '');
  }, [client]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateClientAction(client.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/clients');
        router.refresh(); 
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Cliente <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de Persona de Contacto
        </label>
        <input
          type="text"
          id="contact_name"
          name="contact_name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email de Contacto
        </label>
        <input
          type="email"
          id="contact_email"
          name="contact_email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono de Contacto
        </label>
        <input
          type="tel"
          id="contact_phone"
          name="contact_phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/clients')}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isPending ? 'Guardando Cambios...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
} 