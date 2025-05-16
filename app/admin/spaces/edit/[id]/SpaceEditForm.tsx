'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
import { updateSpaceAction } from '../actions'; // Server Action que crearemos en app/admin/spaces/actions.ts

interface Space {
  id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  rental_fee?: number | null;
  image_url?: string | null;
}

interface SpaceEditFormProps {
  space: Space;
}

export default function SpaceEditForm({ space }: SpaceEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Estados para los campos del formulario, inicializados con los datos del espacio
  const [name, setName] = useState(space.name);
  const [description, setDescription] = useState(space.description || '');
  const [capacity, setCapacity] = useState(space.capacity?.toString() || '');
  const [rentalFee, setRentalFee] = useState(space.rental_fee?.toString() || '');
  const [imageUrl, setImageUrl] = useState(space.image_url || '');

  useEffect(() => {
    // Actualizar estados si el prop 'space' cambia (aunque en este flujo de página no debería)
    setName(space.name);
    setDescription(space.description || '');
    setCapacity(space.capacity?.toString() || '');
    setRentalFee(space.rental_fee?.toString() || '');
    setImageUrl(space.image_url || '');
  }, [space]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    // No es necesario reconstruir formData aquí si los inputs están controlados y los valores son correctos,
    // pero si prefieres enviar solo los datos actuales de los estados, puedes hacerlo.
    // Por simplicidad, la Server Action leerá del FormData que incluye el id.

    startTransition(async () => {
      const result = await updateSpaceAction(space.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/spaces');
        router.refresh(); // Asegura que la lista se actualice
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
      {/* Campo oculto para el ID, aunque la action lo recibe como argumento */}
      {/* <input type="hidden" name="id" value={space.id} /> */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Espacio <span className="text-red-500">*</span>
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
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
          step="0.01"
          value={rentalFee}
          onChange={(e) => setRentalFee(e.target.value)}
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
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/spaces')} // Volver a la lista
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