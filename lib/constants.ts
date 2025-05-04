// Constantes de la aplicación

// URLs de imágenes de Unsplash (temporales para desarrollo)
export const PLACEHOLDER_IMAGES = {
  SPACES: {
    salonPrincipal: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200',
    terrazaJardin: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?q=80&w=1200',
    salonIntimo: 'https://images.unsplash.com/photo-1621915818920-725aa90d4e81?q=80&w=1200',
  },
  PACKAGES: {
    basico: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200',
    premium: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200',
    todoIncluido: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200',
  },
  SERVICES: {
    catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200',
    decoracion: 'https://images.unsplash.com/photo-1478146059778-26028b07385a?q=80&w=1200',
    entretenimiento: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
  },
  HERO: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200',
};

// Datos de catálogo
export const CATALOG_DATA = {
  spaces: [
    {
      id: 1,
      title: 'Salón Principal',
      description: 'Nuestro espacio más amplio con capacidad para 200 invitados, ideal para bodas y grandes celebraciones.',
      capacity: '200 personas',
      image: PLACEHOLDER_IMAGES.SPACES.salonPrincipal,
      type: 'space'
    },
    {
      id: 2,
      title: 'Terraza Jardín',
      description: 'Un hermoso espacio al aire libre rodeado de naturaleza, perfecto para eventos diurnos y ceremonias.',
      capacity: '150 personas',
      image: PLACEHOLDER_IMAGES.SPACES.terrazaJardin,
      type: 'space'
    },
    {
      id: 3,
      title: 'Salón Íntimo',
      description: 'Espacio acogedor para eventos pequeños y reuniones exclusivas.',
      capacity: '50 personas',
      image: PLACEHOLDER_IMAGES.SPACES.salonIntimo,
      type: 'space'
    }
  ],
  packages: [
    {
      id: 1,
      title: 'Paquete Básico',
      description: 'Incluye espacio, mobiliario básico, personal de servicio y menú a elegir.',
      image: PLACEHOLDER_IMAGES.PACKAGES.basico,
      type: 'package'
    },
    {
      id: 2,
      title: 'Paquete Premium',
      description: 'Todo lo del paquete básico más decoración, servicio de DJ, y barra libre de 5 horas.',
      image: PLACEHOLDER_IMAGES.PACKAGES.premium,
      type: 'package'
    },
    {
      id: 3,
      title: 'Paquete Todo Incluido',
      description: 'La experiencia completa con servicio de fotografía, video, coordinador de eventos y más.',
      image: PLACEHOLDER_IMAGES.PACKAGES.todoIncluido,
      type: 'package'
    }
  ],
  services: [
    {
      id: 1,
      title: 'Servicio de Catering',
      description: 'Menús personalizados preparados por nuestros chefs para deleitar a tus invitados.',
      image: PLACEHOLDER_IMAGES.SERVICES.catering,
      type: 'service'
    },
    {
      id: 2,
      title: 'Decoración',
      description: 'Diseño y decoración a medida para crear el ambiente perfecto para tu evento.',
      image: PLACEHOLDER_IMAGES.SERVICES.decoracion,
      type: 'service'
    },
    {
      id: 3,
      title: 'Entretenimiento',
      description: 'DJ, banda en vivo, y otras opciones de entretenimiento para tu celebración.',
      image: PLACEHOLDER_IMAGES.SERVICES.entretenimiento, 
      type: 'service'
    }
  ]
}; 