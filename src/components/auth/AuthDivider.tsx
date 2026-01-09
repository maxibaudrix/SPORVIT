// src/components/auth/AuthDivider.tsx
import React from 'react';

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = 'o' }) => {
  return (
    <div className="relative my-6" role="separator" aria-label={text}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-slate-900 text-slate-400">
          {text}
        </span>
      </div>
    </div>
  );
};
