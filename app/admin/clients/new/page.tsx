'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createClientAction } from '../actions'; // Server Action

export default function NewClientPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    // Validación básica del lado del cliente
    const name = formData.get('name') as string;
    if (!name || name.trim() === '') {
      setError('El nombre del cliente es obligatorio.');
      return;
    }
    // Podrías añadir más validaciones para email y teléfono si lo deseas

    startTransition(async () => {
      const result = await createClientAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/clients');
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Añadir Nuevo Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Cliente (Empresa o Persona) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Persona de Contacto (opcional)
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de Contacto
          </label>
          <input
            type="tel" // type="tel" es más semántico
            id="contact_phone"
            name="contact_phone"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección (opcional)
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
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
            {isPending ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
} 