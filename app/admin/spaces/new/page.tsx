'use client'; // El formulario en sí será un Client Component para interactividad

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createSpaceAction } from '../actions'; // Cambiar a la nueva ruta de la action

export default function NewSpacePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    // Validaciones básicas del lado del cliente (opcional, pero buena práctica)
    const name = formData.get('name') as string;
    if (!name || name.trim() === '') {
      setError('El nombre del espacio es obligatorio.');
      return;
    }
    const rentalFee = formData.get('rental_fee') as string;
    if (rentalFee && isNaN(parseFloat(rentalFee))) {
        setError('El precio de alquiler debe ser un número.');
        return;
    }
    const capacity = formData.get('capacity') as string;
    if (capacity && isNaN(parseInt(capacity, 10))) {
        setError('La capacidad debe ser un número entero.');
        return;
    }

    startTransition(async () => {
      const result = await createSpaceAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Si es exitoso, redirigir a la lista de espacios
        router.push('/admin/spaces');
        // Considera router.refresh() si necesitas que la lista se actualice inmediatamente
        // aunque la redirección a una ruta que es un Server Component debería recargar los datos.
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Añadir Nuevo Espacio</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Espacio <span className="text-red-500">*</span>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad (personas)
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="rental_fee" className="block text-sm font-medium text-gray-700 mb-1">
            Precio de Alquiler ($)
          </label>
          <input
            type="number"
            id="rental_fee"
            name="rental_fee"
            min="0"
            step="0.01" // Para permitir decimales
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL de la Imagen (opcional)
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()} // O router.push('/admin/spaces')
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
            {isPending ? 'Guardando...' : 'Guardar Espacio'}
          </button>
        </div>
      </form>
    </div>
  );
} 