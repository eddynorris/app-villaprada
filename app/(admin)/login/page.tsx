import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <Link href="/" className="text-2xl font-serif text-burgundy-700">
              Fiesta Elegante
            </Link>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Acceso de Administrador
            </h2>
          </div>
          
          <form className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="admin@fiestaelegante.com"
              required
            />
            
            <div>
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                required
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-burgundy-700 hover:text-burgundy-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-burgundy-700 border-gray-300 rounded focus:ring-burgundy-500"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-600">
                Recordarme
              </label>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-burgundy-700">
              ← Volver al sitio principal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 