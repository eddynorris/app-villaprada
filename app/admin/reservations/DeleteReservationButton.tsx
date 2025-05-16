'use client';

import { useTransition } from 'react';
import { deleteReservationAction } from './actions'; // Ajustar si es necesario

interface DeleteReservationButtonProps {
  reservationId: number;
  onActionFinished?: (message: string, error?: boolean) => void; 
}

export default function DeleteReservationButton({ reservationId, onActionFinished }: DeleteReservationButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reservación? Los pagos asociados no se eliminarán automáticamente.')) {
      startTransition(async () => {
        const result = await deleteReservationAction(reservationId);
        if (result.error) {
          console.error('Error deleting reservation:', result.error);
          if (onActionFinished) {
            onActionFinished(result.message, true);
          } else {
            alert(`Error: ${result.message}`);
          }
        } else {
          if (onActionFinished) {
            onActionFinished(result.message, false);
          }
          // La revalidación en la action debería actualizar la lista.
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 disabled:text-red-300 font-medium"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
} 