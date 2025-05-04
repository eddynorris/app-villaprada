import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const colorStyles = {
    primary: 'text-amber-500',
    secondary: 'text-burgundy-700',
    white: 'text-white',
  };
  
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeStyles[size]} ${colorStyles[color]} ${className}`} role="status">
      <span className="sr-only">Cargando...</span>
    </div>
  );
} 