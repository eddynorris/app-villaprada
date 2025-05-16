'use client';

import { useTransition } from 'react';
import { deleteSpaceAction } from './actions'; // Ajusta si la ruta de actions.ts es diferente

interface DeleteSpaceButtonProps {
  spaceId: string;
  spaceName: string;
}

export default function DeleteSpaceButton({ spaceId, spaceName }: DeleteSpaceButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el espacio "${spaceName}"? Esta acción no se puede deshacer.`)) {
      startTransition(async () => {
        const result = await deleteSpaceAction(spaceId);
        if (result?.error) {
          // Podrías mostrar un toast o una alerta más sofisticada aquí
          alert(`Error al eliminar: ${result.error}`);
        }
        // La revalidación en la server action debería actualizar la lista.
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
} 