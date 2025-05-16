import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// La lógica que tenías en updateSession ahora estará dentro de la función middleware
// o puedes mantener updateSession y llamarla desde middleware si prefieres modularidad.
// Por simplicidad, la integraremos directamente en la función middleware.

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Clave para que funcione correctamente:
          // Primero, actualiza la colección de cookies en la petición entrante.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Re-crea la respuesta CON la petición actualizada que incluye la nueva cookie.
          response = NextResponse.next({
            request: {
              headers: request.headers, // Asegúrate de pasar los headers originales también
            },
          });
          // Ahora, establece la cookie en la respuesta saliente.
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '', // Para eliminar, se establece un valor vacío
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Es crucial refrescar la sesión para asegurar que los Server Components
  // tengan la información de sesión más actualizada.
  // Esto también maneja la expiración de tokens.
  await supabase.auth.getUser(); 
  // No necesitas hacer nada con el resultado de getUser() aquí; 
  // su propósito principal en el middleware es refrescar la cookie de sesión si es necesario.

  const { data: { user } } = await supabase.auth.getUser();

  // Proteger rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Usuario no logueado intentando acceder a /admin, redirigir a login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Aquí se podría añadir la lógica para verificar el rol 'is_admin' desde la tabla 'profiles'
    // const { data: profile, error: profileError } = await supabase
    //   .from('profiles')
    //   .select('is_admin')
    //   .eq('id', user.id)
    //   .single();
    // if (profileError || !profile || !profile.is_admin) {
    //   // No es admin o hubo un error, redirigir a una página de no autorizado o a la raíz
    //   return NextResponse.rewrite(new URL('/unauthorized', request.url)); // Necesitarías crear esta página
    // }
  }

  // Si el usuario está logueado e intenta acceder a /login, redirigir a /admin
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (rutas de API)
     * - login (página de login para evitar bucles de redirección)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|login|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Este archivo middleware.ts debería estar en la raíz del proyecto o en src/, no en lib/supabase/
// Por ahora, lo dejamos aquí, pero tendrás que moverlo a la raíz de `app` o `src` y ajustar la ruta de importación.
// También, el archivo debe llamarse `middleware.ts` en la raíz del directorio `app` o `src` o el proyecto. 