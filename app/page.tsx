"use client";

import { redirect } from 'next/navigation';
import HomePage from './(public)/page';

export default function RootPage() {
  // Opción 1: Usar redirección (descomentar para usar esta opción)
  // redirect('/(public)');
  
  // Opción 2: Renderizar directamente el componente de la página pública
  return <HomePage />;
}