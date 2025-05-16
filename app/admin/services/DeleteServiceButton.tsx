'use client';

import { useTransition } from 'react';
import { deleteServiceAction } from './actions';

interface DeleteServiceButtonProps {
  serviceId: string;
  serviceName: string;
}

export default function DeleteServiceButton({ serviceId, serviceName }: DeleteServiceButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${serviceName}"?`)) {
      startTransition(async () => {
        const result = await deleteServiceAction(serviceId);
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