'use client';

import { useTransition } from 'react';
import { deletePaymentAction } from '../../actions'; // Corregida la ruta

interface DeletePaymentButtonProps {
  paymentId: string;
  reservationId: number;
  onActionFinished?: (message: string, error?: boolean) => void;
}

export default function DeletePaymentButton(
  { paymentId, reservationId, onActionFinished }: DeletePaymentButtonProps
) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      startTransition(async () => {
        const result = await deletePaymentAction(paymentId, reservationId);
        if (result.error) {
          console.error('Error deleting payment:', result.error);
          if (onActionFinished) {
            onActionFinished(result.message || 'Ocurrió un error al eliminar el pago.', true);
          } else {
            alert(`Error: ${result.message}`);
          }
        } else {
          if (onActionFinished) {
            onActionFinished(result.message, false);
          }
          // La revalidación en la action debería actualizar la lista y el formulario principal.
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-500 hover:text-red-700 disabled:text-red-300"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
} 