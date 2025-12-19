import React, { InputHTMLAttributes } from 'react';

// Define la interfaz de props para el componente Checkbox
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
        {...props}
      />
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
};