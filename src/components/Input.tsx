import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, icon, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-error focus:border-error focus:ring-error' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500';
    
    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${icon ? 'pl-10' : 'pl-3'} 
              pr-3 py-2 bg-white border ${errorClass} 
              rounded-md shadow-sm text-neutral-900
              focus:outline-none focus:ring-1
              disabled:bg-neutral-100 disabled:text-neutral-500 
              transition-colors duration-200
              w-full
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;