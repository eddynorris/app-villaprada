import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', required, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label className="text-gray-700 font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            border border-gray-300 rounded-md p-2
            focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 