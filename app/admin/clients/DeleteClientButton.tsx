'use client';

import { useTransition } from 'react';
import { deleteClientAction } from './actions';

interface DeleteClientButtonProps {
  clientId: string;
  clientName: string;
}

export default function DeleteClientButton({ clientId, clientName }: DeleteClientButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente "${clientName}"?`)) {
      startTransition(async () => {
        const result = await deleteClientAction(clientId);
        if (result?.error) {
          alert(`Error al eliminar: ${result.error}`);
        }
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