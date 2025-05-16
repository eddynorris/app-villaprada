'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client'; // Ajusta la ruta si no usas alias @/
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Definimos un tipo para el usuario para mejorar la claridad
interface User {
  id: string;
  email?: string;
  // Puedes añadir más campos del usuario aquí si los necesitas
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Error getting session or no session:', sessionError);
        router.push('/login'); // Redirigir si no hay sesión
        return;
      }
      // Asumimos que si hay sesión, hay usuario.
      // supabase.auth.getUser() también podría usarse aquí si necesitas refrescar info.
      if (session.user) {
        setUser({ id: session.user.id, email: session.user.email });
      }
      setLoading(false);
    };
    getUserData();
  }, [supabase, router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      // Podrías mostrar un mensaje de error al usuario aquí
    } else {
      setUser(null); // Limpiar el estado del usuario
      router.push('/login'); // Redirigir a la página de login
      router.refresh(); // Asegurar que el estado del servidor se actualice
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    // Esto no debería ocurrir si la redirección en useEffect funciona, pero es un fallback.
    // El middleware ya debería haber redirigido si no hay usuario.
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>No estás autorizado. Redirigiendo a login...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Panel de Administración</h1>
        <p className="text-center text-gray-600">
          ¡Bienvenido, <span className="font-semibold">{user.email || 'Administrador'}</span>!
        </p>
        <p className="text-center text-gray-500 text-sm">
          Esta es tu área de administración. Desde aquí podrás gestionar los diferentes aspectos de la plataforma.
        </p>
        
        {/* Aquí irán los enlaces a las diferentes secciones del CRUD más adelante */}
        <div className="mt-6 text-center">
          <p className="text-indigo-600">Próximamente: Gestión de Espacios, Servicios, Clientes, etc.</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
} 