// src/components/auth/AuthButton.tsx
import React from 'react';
import { Loader } from 'lucide-react';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary' | 'google';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  isLoading = false,
  children,
  icon,
  fullWidth = true,
  ariaLabel
}) => {
  const baseClasses = `
    ${fullWidth ? 'w-full' : ''}
    flex items-center justify-center gap-2 sm:gap-3
    px-4 sm:px-6 py-3
    rounded-xl font-semibold
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-teal-600
      hover:shadow-lg hover:shadow-emerald-500/50
      hover:scale-[1.02] active:scale-[0.98]
      text-white
      focus:ring-emerald-500
    `,
    secondary: `
      bg-slate-700 hover:bg-slate-600
      text-white border border-slate-600
      focus:ring-slate-500
    `,
    google: `
      bg-white hover:bg-gray-50
      text-gray-900 border border-gray-300
      focus:ring-gray-300
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {isLoading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
