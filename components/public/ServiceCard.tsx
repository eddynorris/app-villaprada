import Image from 'next/image';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  capacity?: string;
  image: string;
  type: 'space' | 'package' | 'service';
  href: string;
}

export default function ServiceCard({ 
  title, 
  description, 
  capacity, 
  image, 
  type, 
  href 
}: ServiceCardProps) {
  // Si la imagen no existe o es una ruta que no existe aún, usar un placeholder
  const placeholderColors = {
    space: 'bg-amber-100',
    package: 'bg-burgundy-100',
    service: 'bg-blue-100',
  };

  // Comprobar si la imagen es una URL o una ruta local que necesita placeholder
  const needsPlaceholder = !image || image.startsWith('/images/') && !image.includes('placeholder');
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="relative h-64 w-full">
        {needsPlaceholder ? (
          <div className={`absolute inset-0 ${placeholderColors[type]} flex items-center justify-center`}>
            <div className="text-center p-4">
              <Image
                src="/window.svg"
                alt={title}
                width={64}
                height={64}
                className="mx-auto mb-2 opacity-70"
              />
              <span className="block text-lg font-bold capitalize">{type}: {title}</span>
            </div>
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        {capacity && (
          <p className="mt-2 text-sm text-gray-500">
            Capacidad: {capacity}
          </p>
        )}
        <Link 
          href={href}
          className="mt-4 inline-block text-burgundy-700 hover:text-burgundy-800"
        >
          Ver más detalles
        </Link>
      </div>
    </div>
  );
} 