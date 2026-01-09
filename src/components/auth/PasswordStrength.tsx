// src/components/auth/PasswordStrength.tsx
import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const passwordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const labels = ['', 'Débil', 'Media', 'Buena', 'Fuerte'];
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-emerald-500'];

  return {
    strength,
    label: labels[strength],
    color: colors[strength],
    textColor: textColors[strength]
  };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = passwordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 flex justify-between items-center text-xs animate-in fade-in duration-200">
      <span className={`font-semibold ${strength.textColor}`}>
        {strength.label}
      </span>
      <div className="flex space-x-1" role="progressbar" aria-valuenow={strength.strength} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              i <= strength.strength ? strength.color : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
